#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//


// configure all the files to copy.
// Key of object is the source file,
// value is the destination location.
// It's fine to put all platforms' icons
// and splash screen files here, even if
// we don't build for all platforms
// on each developer's box.

var filestocopy = [{
    "app_resources/icons/android/icon-36-ldpi.png":
    "platforms/android/res/drawable/icon.png"
}, {
    "app_resources/icons/android/icon-72-hdpi.png":
    "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "app_resources/icons/android/icon-36-ldpi.png":
    "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "app_resources/icons/android/icon-48-mdpi.png":
    "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "app_resources/icons/android/icon-96-xdpi.png":
    "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "app_resources/screens/android/screen-ldpi-portrait.png":
    "platforms/android/res/drawable/splash.png"
}, {
    "app_resources/screens/android/screen-hdpi-portrait.png":
    "platforms/android/res/drawable-hdpi/splash.png"
}, {
    "app_resources/screens/android/screen-ldpi-portrait.png":
    "platforms/android/res/drawable-ldpi/splash.png"
}, {
    "app_resources/screens/android/screen-mdpi-portrait.png":
    "platforms/android/res/drawable-mdpi/splash.png"
}, {
    "app_resources/screens/android/screen-xdpi-portrait.png":
    "platforms/android/res/drawable-xhdpi/splash.png"
}, {
    "app_resources/icons/ios/icon-72.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-72.png"
}, {
    "app_resources/icons/ios/icon-72.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-76.png"
}, {
    "app_resources/icons/ios/icon-small.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-small.png"
}, {
    "app_resources/icons/ios/icon-small@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-small@2x.png"
},  {
    "app_resources/icons/ios/icon-40.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-40.png"
}, {
    "app_resources/icons/ios/icon-40@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-40@2x.png"
}, {
    "app_resources/icons/ios/icon-50.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-50.png"
}, {
    "app_resources/icons/ios/icon-50@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-50@2x.png"
}, {
    "app_resources/icons/ios/icon-60.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-60.png"
}, {
    "app_resources/icons/ios/icon-60@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-60@2x.png"
}, {
    "app_resources/icons/ios/icon-57.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon.png"
}, {
    "app_resources/icons/ios/icon-57@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon@2x.png"
}, {
    "app_resources/icons/ios/icon-72@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-72@2x.png"
}, {
    "app_resources/icons/ios/icon-72@2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/icons/icon-76@2x.png"
}, {
    "app_resources/screens/ios/screen-iphone-portrait-2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/splash/Default@2x~iphone.png"
}, {
    "app_resources/screens/ios/screen-iphone-portrait-568h-2x.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "app_resources/screens/ios/screen-iphone-portrait.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/splash/Default~iphone.png"
}
, {
    "app_resources/screens/ios/Default-Portrait~ipad.png":
     "platforms/ios/Ice Bucket Collect Challange/Resources/splash/Default-Portrait~ipad.png"
}, {
    "app_resources/screens/ios/Default-Portrait@2x~ipad.png":
    "platforms/ios/Ice Bucket Collect Challange/Resources/splash/Default-Portrait@2x~ipad.png"
}
];


var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.cwd();

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];

        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);

        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            console.log("copying "+srcfile+" to "+destfile);
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
