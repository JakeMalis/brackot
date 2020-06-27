var imlocation = "media/load-image/";
var currentdate = 0;
var image_number = 0;
function ImageArray (n) {
    this.length = n;
    for (var i =1; i <= n; i++) {
        this[i] = ' '
    }
}
image = new ImageArray(3)
image[0] = '1.jpg'
image[1] = '2.jpg'
image[2] = '3.jpg'
var rand = 60/image.length
function randomimage() {
    currentdate = new Date()
    image_number = currentdate.getSeconds()
    image_number = Math.floor(image_number/rand)
    return(image[image_number])
}
document.write("<img id='loginImage' src='" + imlocation + randomimage()+ "'>");
