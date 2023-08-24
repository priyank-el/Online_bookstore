const cron = require('node-cron')

const RECOMMAND = require('../models/recommandationSchema')
const NOTIFY = require('../models/notificationSchema')

cron.schedule('* 23 * * *' , () => {
    sendNotification()
})

const sendNotification = async (req,res) => {
    console.log("I am running jobs");
    const allUsers = await RECOMMAND.find()

    for(let i = 0;i<allUsers.length;i++){
        try {
            const userId = allUsers[i].userId
    
            const notification = await NOTIFY.create({
                notification : 'Check-out for new books in store..',
                userId
            })
            console.log(notification);
        } catch (error) {
            return res.json({
                success:false,
                errors:error.message
            })
        }
    }
}