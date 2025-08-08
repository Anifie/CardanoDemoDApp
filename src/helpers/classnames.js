/*
Alternative to package `classnames`:
- concat a list of className into one
- support conditional className
*/
const cls = function (...args) {
    let classString = ""
    const classes = []
    Array.from(args).forEach((arg) => {
        if (typeof arg === "object") {
            Object.keys(arg).forEach((key) => {
                classes.push(arg[key] ? key : "")
            })
        } else {
            classes.push(arg)
        }
    })

    classString = classes.filter((c) => c !== "").join(" ")
    return classString
}
export default cls
