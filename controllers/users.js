const User = require("../models/user")

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.Login =  async (req,res)=>{
    req.flash("success","LogIn Successfully.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}

module.exports.renderSignIn = (req,res)=>{
    res.render("users/signIn")
}

module.exports.signIn =async(req,res)=>{
    let{username,email,password} = req.body;
    console.log(username, email, password);
    let user1 = new User({
        email:email,
        username:username
    })
    let registerdUser = await User.register(user1,password);
    req.login(registerdUser,(err)=>{
        if(err){
            return(next(err))
        }
        else{
            req.flash("success","Welcome to WonderLust. ");
        return  res.redirect("/listings")
        }
    })
}

module.exports.logOut =(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Loggout successfully");
        return res.redirect("/listings");
    })
}

module.exports.myOrders = async(req,res)=>{
    let user = await User.findById(res.locals.currUser._id).populate("orders");
    let orders = user.orders;
    res.render("users/orders.ejs",{orders})
    // res.send(orders);
}