import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const prisma = new PrismaClient()

async function main() {
    console.log('🔗 Bắt đầu liên kết/tạo tài khoản Supabase Auth...')

    const usersToSetup = [
        { email: 'director@crmpro.vn', password: 'password123' },
        { email: 'manager@crmpro.vn', password: 'password123' },
        { email: 'sale.a@crmpro.vn', password: 'password123' },
        { email: 'sale.b@crmpro.vn', password: 'password123' },
        { email: 'sale.c@crmpro.vn', password: 'password123' },
    ]

    for (const u of usersToSetup) {
        try {
            // Create user directly, assuming email confirm isn't strictly required or we force it true
            let authUid = ''

            const { data, error } = await supabase.auth.admin.createUser({
                email: u.email,
                password: u.password,
                email_confirm: true,
            })

            if (error && error.message.includes('already been registered')) {
                // User already exists, try to fetch them and update password
                console.log(`⚠️ User ${u.email} already exists in Auth. Resetting password and linking...`)
                const { data: listData } = await supabase.auth.admin.listUsers()
                const existingUser = listData.users.find(x => x.email === u.email)

                if (existingUser) {
                    await supabase.auth.admin.updateUserById(existingUser.id, { password: u.password })
                    authUid = existingUser.id
                }
            } else if (error) {
                console.error(`❌ Lỗi tạo ${u.email}:`, error.message)
                continue
            } else if (data.user) {
                authUid = data.user.id
            }

            if (authUid) {
                // Update Prisma User mapping
                const result = await prisma.user.updateMany({
                    where: { email: u.email },
                    data: { supabaseId: authUid }
                })
                if (result.count > 0) {
                    console.log(`✅ [OK] ${u.email} -> Lên Supabase Auth (Mật khẩu: password123)`)
                } else {
                    console.log(`⚠️ [WARNING] Cập nhật Auth nhưng không tìm thấy user ${u.email} trong DB gốc.`)
                }
            }

        } catch (e) {
            console.error(`❌ Cú pháp lỗi ${u.email}:`, e)
        }
    }

    console.log('✅ XONG! Hãy dùng password123 để trải nghiệm!')
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
