const  AdminUser = require('./adminSchema')

 const initializeAdmin = async () => {
    const newAdmin = new AdminUser({
        email: "313bdc@gmail.com",
        password: "@BdcAdmin",
        rank: "SUPERADMIN"
      });
  
        newAdmin.save((err, doc) => {
            console.log(doc)
        })
    
   
}

 const adminCheck= async () => {
     var admin = await AdminUser.find({}).sort({_id:-1}).limit(1);
     if(admin.length == 0){
         console.log("initilizing admin")
         let initAdmin = await initializeAdmin()
         console.log("initilized admin")
     }  else {
        console.log("admin available")
     }

}

module.exports = adminCheck()