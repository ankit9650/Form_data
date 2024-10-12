
const logmw = (req, res, next) => {
    console.log("right!!!");
    next(); 
}
app.use(logmw);
