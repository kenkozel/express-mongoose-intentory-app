var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Shipment        = require("./models/shipment"),
    Update        = require("./models/update"),
    User        = require("./models/user"),
    session = require("express-session"),
    $ = require("jquery"),
    methodOverride = require("method-override"),

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/devdata_v5';

mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "#,hm!KKk9nW-EnT{V_8xcDRJ#,hm!KKk9nW-EnT{V_8xcDRJ#,hm!KKk9nW-EnT{V_8xcDRJ",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});
//LANDING PAGE ROUTE
app.get("/", function(req, res){
        res.render("landing");
});

/////////////////////
//SHIPMENT ROUTES
////////////////////

//INDEX SHOW ALL SHIPMENTS
app.get("/shipment", function(req, res){
        //get all data from db
        Shipment.find({}, function(err, allShipments){
                if(err){
                        console.log(err);
                } else {
			//res.status(200).json(allData);
			//res.sendFile(__dirname + "/results.ejs");
                        res.render("shipments/index",{shipments:allShipments});
                }
        });
});

//CREATE-ADD NEW SHIPMENT
app.post("/shipment", isLoggedIn, function(req, res){
        var market = req.body.market;
	var shippingnumber = req.body.shippingnumber;
	var loaddate = req.body.loaddate;
	var shipname = req.body.shipname;
	var cowsalive = req.body.cowsalive;
 	var cowrfid = req.body.cowrfid;
	var author = {
		id: req.user._id,
		username: req.user.username
		}
        var newShipment = {market: market, shippingnumber: shippingnumber, loaddate: loaddate, shipname: shipname, cowsalive: cowsalive, cowrfid: cowrfid, author: author}
        //save to DB
        Shipment.create(newShipment, function(err, newlyCreated){
                if(err){
                        console.log(err);
                } else {
                        console.log(newlyCreated);
			res.redirect("/shipment");
                }
        });
});

//NEW-SHOW FORM TO CREATE NEW SHIPMENT
app.get("/shipment/new", isLoggedIn, function(req, res){
       res.render("shipments/new");
});

//VIEW SHIPMENT REORT 
app.get("/shipment/report", isLoggedIn, function(req, res){
        //get all data from db
        Shipment.find({}, function(err, allShipment){
                if(err){
                        console.log(err);
                } else {
                        //res.status(200).json(allData);
                        //res.sendFile(__dirname + "/results.ejs");
                        res.render("shipments/shipmentreport",{shipment:allShipment});
                        }

		});
});

// SHOW - shows more info about one shipment
app.get("/shipment/:id", isLoggedIn, function(req, res){
    //find the shipmentwith provided ID
    Shipment.findById(req.params.id).populate("updates").exec(function(err, foundShipment){
        if(err){
            console.log(err);
        } else {
            console.log(foundShipment)
            //render show template with that shipment
            res.render("shipments/show", {shipment: foundShipment});
       		//res.send("this is the show by id page");
	 }
    });
});

////////////////////////
// UPDATE ROUTES
///////////////////////

//NEW-SHOW FORM TO CREATE NEW UPDATE
app.get("/shipment/:id/update/new", function(req, res){
        //get all data from db
        Shipment.findById(req.params.id, function(err, allShipments){
                if(err){
                        console.log(err);
                } else {
		res.render("shipments/update", {shipments: allShipments});
		}
        });
});

//CREATE - NEW UPDATE POST
app.post("/shipment/:id/update", function(req, res){
	Shipment.findById(req.params.id, function(err, shipment){
		if(err){
			console.log(err);
			res.redirect("/shipment");
		} else {
        var updatenumber = req.body.updatenumber;
	var market = req.body.market;
        var updatedtill = req.body.updatedtill;
        var importer = req.body.importer;
        var feedlot = req.body.feedlot;
        var abattior = req.body.abattior;
	var cowsprocessed = req.body.cowsprocessed;
	var cowsalive = req.body.cowsalive;
	var cowsmortal = req.body.cowsmortal;
	var cowsuntracked = req.body.cowsuntracked;
        var cowrfid = req.body.cowrfid;
        var newUpdate ={updatenumber:updatenumber, market: market, updatedtill:updatedtill, importer:importer, feedlot: feedlot, abattior: abattior, cowsprocessed: cowsprocessed, cowsalive: cowsalive, cowsmortal: cowsmortal, cowsuntracked: cowsuntracked, cowrfid: cowrfid}
        //SAVE TO DB
        Update.create(newUpdate, function(err, update){
                if (err){
                        console.log(err);
                } else {
			//SAVE UPDATE	
			update.author.id = req.user._id;
			update.author.username = req.user.username;
			update.save();
                        console.log(update);
			shipment.updates.push(update);
			shipment.save();
			req.flash('success', 'Created a update!');
                        res.redirect("/shipment/" + shipment._id);
                		}
			});
		}
       });
});
//////////////////////
//AUTHENTICATION ROUTES
//=====================

//Register route
app.get("/register", function(req, res){
   res.render("register");
});

//Sign up route
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/shipment");
        });
    });
});
//LOGIN ROUTES
// show login form
app.get("/login", function(req, res){
   res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/shipment",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/shipment");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(80, function(){
   console.log("Cattle App  port 80 started...");
});
