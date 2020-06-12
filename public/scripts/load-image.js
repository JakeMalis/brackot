var imlocation = "https://allstaresports.com/s/";
var currentdate = 0;
var image_number = 0;
function ImageArray (n) {
    this.length = n;
    for (var i =1; i <= n; i++) {
        this[i] = ' '
    }
}
image = new ImageArray(3)
image[0] = 'login1'
image[1] = 'login2'
image[2] = 'login3'
var rand = 60/image.length
function randomimage() {
    currentdate = new Date()
    image_number = currentdate.getSeconds()
    image_number = Math.floor(image_number/rand)
    return(image[image_number])
}
document.write("<img id='loginImage' src='" + imlocation + randomimage()+ "'>");