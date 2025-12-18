const FacebookBot = require('./facebook-bot');
const fs = require('fs');
const colors = require('colors');

class GroupFetcher extends FacebookBot {
    constructor() {
        super();
    }

    async getAllGroups(limit = null) {
        try {
            console.clear();
            console.log('\n' + '🌟'.rainbow, 'FACEBOOK GROUP FETCHER'.rainbow.bold, '🌟'.rainbow);
            console.log('='.repeat(60).rainbow);

            console.log('🔍'.cyan, 'Fetching ALL Facebook groups...'.cyan);
            console.log('ℹ️'.yellow, 'This may take a while depending on number of groups'.yellow);
            console.log('─'.repeat(60).gray);

            let allGroups = [];
            let nextUrl = `${this.baseURL}/me/groups?access_token=${this.config.access_token}&fields=id,name,privacy,member_count,updated_time&limit=100`;
            let pageCount = 0;
            let totalFetched = 0;

            while (nextUrl) {
                pageCount++;
                console.log(`\n📄`.magenta, `Fetching page ${pageCount}...`.magenta);

                const response = await this.makeRequest('GET', nextUrl);

                if (response.data && response.data.length > 0) {
                    allGroups = allGroups.concat(response.data);
                    totalFetched = allGroups.length;

                    // แสดง progress
                    console.log(`📊`.cyan, `Progress: ${totalFetched} groups fetched`.cyan);

                    // จำกัดจำนวนหากระบุ limit
                    if (limit && totalFetched >= limit) {
                        allGroups = allGroups.slice(0, limit);
                        console.log(`🎯`.green, `Limit reached: ${limit} groups`.green);
                        break;
                    }

                    // ตรวจสอบว่ามีหน้าต่อไปไหม
                    if (response.paging && response.paging.next) {
                        console.log(`⏱️`.yellow, `Waiting ${this.delay}ms...`.yellow);
                        await this.sleep(this.delay);
                        nextUrl = response.paging.next;
                    } else {
                        nextUrl = null;
                    }
                } else {
                    nextUrl = null;
                }
            }

            console.log('\n' + '✅'.green.bold, 'COMPLETED!'.green.bold);
            console.log('📊'.magenta, `Total groups fetched: ${allGroups.length}`.magenta.bold);

            // เรียงลำดับตามจำนวนสมาชิก (มากไปน้อย)
            const sortedGroups = allGroups.sort((a, b) => (b.member_count || 0) - (a.member_count || 0));

            // แสดงสถิติ
            this.showStatistics(sortedGroups);

            // บันทึกไฟล์
            this.saveGroups(sortedGroups);

            return sortedGroups;
        } catch (error) {
            console.error('❌'.red, 'Error fetching groups:', error.message);
            throw error;
        }
    }

    showStatistics(groups) {
        console.log('\n' + '📈'.yellow, 'GROUP STATISTICS'.yellow.bold);
        console.log('─'.repeat(60).gray);

        const total = groups.length;
        const openGroups = groups.filter(g => g.privacy === 'OPEN').length;
        const closedGroups = groups.filter(g => g.privacy === 'CLOSED').length;
        const secretGroups = groups.filter(g => g.privacy === 'SECRET').length;

        // คำนวณสมาชิกทั้งหมด
        const totalMembers = groups.reduce((sum, group) => sum + (group.member_count || 0), 0);
        const avgMembers = Math.round(totalMembers / total);

        console.log(`📊 Total Groups: ${total.toString().cyan.bold}`);
        console.log(`👥 Total Members (across all groups): ${totalMembers.toLocaleString().blue.bold}`);
        console.log(`📈 Average Members per Group: ${avgMembers.toLocaleString().blue}`);

        console.log('\n' + '🔐'.magenta, 'PRIVACY DISTRIBUTION'.magenta.bold);
        console.log(`🌐 Open: ${openGroups.toString().green} (${((openGroups / total) * 100).toFixed(1)}%)`);
        console.log(`🔒 Closed: ${closedGroups.toString().yellow} (${((closedGroups / total) * 100).toFixed(1)}%)`);
        console.log(`👥 Secret: ${secretGroups.toString().magenta} (${((secretGroups / total) * 100).toFixed(1)}%)`);

        // แสดงกลุ่มใหญ่สุด 5 กลุ่ม
        if (groups.length > 0) {
            console.log('\n' + '🏆'.cyan, 'TOP 5 LARGEST GROUPS'.cyan.bold);
            console.log('─'.repeat(60).gray);
            groups.slice(0, 5).forEach((group, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const privacyIcon = group.privacy === 'OPEN' ? '🌐' : group.privacy === 'CLOSED' ? '🔒' : '👥';

                console.log(`${medal} ${group.name.yellow}`);
                console.log(`   ${'🆔'.cyan} ID: ${group.id.cyan}`);
                console.log(`   ${'👥'.blue} Members: ${group.member_count.toLocaleString().blue.bold}`);
                console.log(`   ${privacyIcon} Privacy: ${group.privacy}`);
                console.log('─'.repeat(40).gray);
            });
        }
    }

    saveGroups(groups) {
        try {
            // บันทึกเป็น JSON
            const jsonData = groups.map((group, index) => ({
                rank: index + 1,
                id: group.id,
                name: group.name,
                privacy: group.privacy,
                member_count: group.member_count,
                updated_time: group.updated_time
            }));

            fs.writeFileSync('./groups.json', JSON.stringify(jsonData, null, 2));
            console.log('💾'.green, 'Groups saved to'.white, 'groups.json'.cyan);

            // บันทึกเป็น CSV
            this.saveAsCSV(groups);

            // บันทึกเฉพาะ ID
            this.saveGroupIds(groups);

        } catch (error) {
            console.error('❌'.red, 'Error saving groups:', error.message);
        }
    }

    saveAsCSV(groups) {
        try {
            const csvHeader = 'Rank,Group ID,Group Name,Privacy,Member Count,Last Updated\n';
            const csvRows = groups.map((group, index) =>
                `${index + 1},${group.id},"${group.name.replace(/"/g, '""')}",${group.privacy},${group.member_count},${group.updated_time}`
            ).join('\n');

            const csvContent = csvHeader + csvRows;
            fs.writeFileSync('./groups.csv', csvContent, 'utf8');
            console.log('💾'.green, 'Groups saved to'.white, 'groups.csv'.cyan);
        } catch (error) {
            console.error('❌'.red, 'Error saving CSV:', error.message);
        }
    }

    saveGroupIds(groups) {
        try {
            const ids = groups.map(group => group.id);
            fs.writeFileSync('./group_ids.txt', ids.join('\n'));
            console.log('💾'.green, 'Group IDs saved to'.white, 'group_ids.txt'.cyan);
            console.log(`📄 Total IDs: ${ids.length}`.cyan);
        } catch (error) {
            console.error('❌'.red, 'Error saving group IDs:', error.message);
        }
    }
}

// ใช้งานเมื่อเรียกไฟล์โดยตรง
if (require.main === module) {
    (async () => {
        try {
            const fetcher = new GroupFetcher();

            // สามารถกำหนด limit ได้ (เช่น 50, 100, หรือ null สำหรับทั้งหมด)
            await fetcher.getAllGroups(null); // null = ดึงทั้งหมด

            console.log('\n' + '✨'.rainbow, 'OPERATION COMPLETED!'.green.bold, '✨'.rainbow);
            console.log('='.repeat(60).rainbow);
        } catch (error) {
            console.error('\n❌'.red.bold, 'Error:'.white, error.message.red);
            process.exit(1);
        }
    })();
}

module.exports = GroupFetcher;