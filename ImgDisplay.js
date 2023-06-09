//==================| Elements & Vars |====================================================

//the stuff |-----------------------------------------------------
var gallery = document.getElementById('gallery');
const modals = document.getElementsByClassName("modal");
const mcont = document.getElementById('mcont');
let height = 400;
setHeight();
let modalOpen = false;
let inGallery = true;

//functions for this stuff |-----------------------------------------------------
function setHeight() { //can call any time
    document.head.innerHTML += '<style> .imgframe {height:' + height + 'px;}</style>';
}
function changeHeight(i) {
    height = i;
    setHeight();
}

function changeInGallery(b) {
    inGallery = b;
}

function setScroll() {
    if (modalOpen == true) {
        document.body.style.overflowY = 'hidden';
    }
    else {
        document.body.style.overflowY = 'scroll';
    }
}

function setGallery(s) {
    gallery.innerHTML = s;
}
function addGallery(s) {
    setGallery(gallery.innerHTML + s);
}

/* =========================| Images |======================================================== */
//basic reference functions
function getImg(i) {
    //returns the image object for i (index)
    return allImgs[i];
}
function getSet(si) {
    //returns the image set with index si (set index)
    return imgSets[si];
}
function getGooglePath(id) {
//function for creating google docs path
    //id rrefers to the long string after the google share thing
    return "https://drive.google.com/uc?id=" + id;
}



//inner display (for modals and inside of thumbnails)
function getSetDiv(si) { 
    let i = getSet(si).tnIndex;
    //for set thumbnails, do not use inside modal
    return '<div class="test" ' + getDivStyle(getDivAspect(i)) + ' > ' + getSetElement(si) + ' </div>';
}

function getImgDiv(i, formodal) { //TODO test
    //this is needed for lazy loading I think
    return '<div class="test" ' + getDivStyle(getDivAspect(i)) + ' > ' + getImgElement(i, formodal) + ' </div>';
}

function getDivStyle(s) {
    //where s is the strings inside the style thing
    return ' style="' + s + '" ';

}
function getDivAspect(i) {
    //where i is the index of the img in allimgs
    //aspect-ratio:1/1;
    return 'aspect-ratio:' + getImg(i).ratio + ';';

}

function getImgElement(i, formodal) { //TODO test
    //gets the image element using index of 
    var img = getImg(i);

    //check for srcset attribute
    if (Object.hasOwn(img, 'srcset') && img.srcset != '') {
        return '<img'
            + getImgID(i)
            + getTitleImg(i)
            + getClass(img)
            + getSRCSET(img)
            + getSize(i, formodal)
            + getAlt(img)
            + getLazyLoad()
            + ' /> ';
    }
    else {
        return '<img'
            + getImgID(i)
            + getTitleImg(i)
            + getClass(img)
            + getSRC(img)
            + getAlt(img)
            + getLazyLoad()
            + ' /> ';
    }

   

}
function getSetElement(si) { //TODO test for errors
    //gets the image element using index of 
    var i = getSet(si).tnIndex;
    var img = getImg(i);

    if (Object.hasOwn(img, 'srcset') && img.srcset != '') {
        return '<img'
            + getSetID(i)
            + getTitleSet(si)
            + getClass(img)
            + getSRCSET(img)
            + getSize(i, false)
            + getAlt(img)
            + getLazyLoad()
            + ' /> '; 
    }
    else {
        return '<img'
            + getSetID(i)
            + getTitleSet(si)
            + getClass(img)
            + getSRC(img)
            + getAlt(img)
            + getLazyLoad()
            + ' /> ';
    }
}

function getClass(img) {
    return ' class = "gal ' + img.bg + '" ';

}
function getSRC(img) {
    return ' src = "' + getGooglePath(img.id) + '" ';
}
function getAlt(img) {
    return ' alt = "' + img.name + '" ';
}
function getLazyLoad() {
    return ' loading = "lazy" ';

}

function getTitleImg(i) {
    if (inGallery) {
        return ' title="i' + i + '" '
    }
    else {
        return '';
    }
}
function getTitleSet(si) {
    if (inGallery) {
        return ' title="s' + si + '" '
    }
    else {
        return '';
    }
}

function getImgID(i) {
    //where i is the image index in allimg
    return ' id = "i' + i + '" ';
}
function getSetID(si) {
    //where si is the set index in imgsets
    return ' id = "s' + si + '" ';
}


//TODO new tumblr link functions
function getSRCSET(img) {
    return 'srcset="' + img.srcset + '"';
}
function getSize(i, formodal) {
    //the img object and if it's for gallery of modal


    if (formodal) {
        if (Number(window.innerWidth) >= 720) {
            return 'sizes="70vw"';
        }
        else {
            return 'sizes="90vw"';
        }
        
    }
    else {
        return 'sizes="' + getWidth(i) + 'px"';
    }
}

//outer display for thumbnails

function getImgGalleryDiv(i) { //TODO test
    //where i is the Set number
    let front = '<div class="imgframe"' + getFrameStyle(i) + getActionImg(i) + '><div class="imgcont">';
    let mid = '</div>';
    let back = '</div>';
    return front + getImgDiv(i, false) + mid + back;
}
function getActionImg(i) {
    return ' onclick="openModalImg(' +i+ ') " ';
}
function getSetGalleryDiv(si) {
    //where si is the Set number
    let front = '<div class="imgframe"' + getFrameStyle(getSet(si).tnIndex) + getActionSet(si) + '><div class="imgcont">';
    let mid = '</div>';
    let back = '</div>';
    return front + getSetDiv(si) + mid + getSetInd(si) + back;
}
function getActionSet(si) {
    return ' onclick=" openModalSet( ' + si + ')" ';
}

function getFrameStyle(i) {
    //sets the frame style to be the right width for gallery
    //add here for more styles
    return ' style="width:' + getWidth(i) + 'px" ';
}
function getSetInd(si) {
    //returns no Set ind if Set only has 1 item,
    //and returns the Set ind str otherwise
    if (imgSets[si].imgsIndex.length == 1) {
        return '';
    }
    else {
        return '<div class="stackind"></div>';
    }
}

//quick sets - one type
function setGallerySomeImgs(a, b) {
    gallery.innerHTML = '';
    for (i = b; i >= a; i--) {
        addGallery(getImgGalleryDiv(i));
    }
}
function setGalleryAllImgs() {
    gallery.innerHTML = '';
    for (i = allImgs.length-1; i >= 0 ; i--) {
        addGallery(getImgGalleryDiv(i));
    }
}

function setGalleryAllSets() {
    vore = '';
    for (si = 0; si < imgSets.length; si++) {
        vore += getSetGalleryDiv(si);
    }
    gallery.innerHTML = vore;
}




//These are for imge aspect ratios 
function findGCD(a, b) {
    let n = 0;
    let d = 0;

    if (a > b) {
        n = a;
        d = b;
    }
    else {
        n = b;
        d = a;
    }

    if (n == 0 || d == 0) {
        return 0;
    }

    let r = n % d;

    while (r != 0) {
        n = d;
        d = r;
        r = n % d;
    }

    return d;
}
function simplify(a, b) {
    //this does not return backlashes for easy manual pasting
    let gcd = findGCD(a, b);
    a = a / gcd;
    b = b / gcd;
    return " " + a + "_" + b + " ";
}
function getWidth(i) {
    let a = ratioToInts(i);
    return height * (a[0] / a[1]);
}
function ratioToInts(i) {
    s = getImg(i).ratio;
    if (s.includes('/')) {
        a = s.split('/');
        return [Number(a[0]), Number(a[1])];
    }
    else {
        a = Number(s);
        return [a, 1];
    }
 

}

//===================|modals|=======================================
//modal code, make sure you only have 1 modal
/** example modal html
 
     <div class="modal">
        <div class="close" onclick="closeModal()">
            <p>&times</p>
        </div>

        <div class="expcont">
        <!-- actual content here -->
        </div>

    </div>
 
 
 */

function closeModal() {
    for (i = 0; i < modals.length; i++) {
        modals[i].style.display = 'none';
    }
    modalOpen = false;
    //console.log('modal Opened:' + modalOpen);
    setScroll();
}

function openModal() {
    for (i = 0; i < modals.length; i++) {
        modals[i].style.display = 'block';
        modals[i].scrollTo(0, 0);
    }
    modalOpen = true;
    //console.log('modal Opened:' + modalOpen);
    setScroll();
}
function openModalSet(si) {
    openModal();
    mcont.innerHTML = getModalSet(si);
}
function openModalImg(i) {
    //console.log('img requested:' + i);
    openModal();
    mcont.innerHTML = getModalImage(i);
}


function getModalSet(si) {
    var set = getSet(si);
    let sn = '';
    let sd = '';
    if (set.name != '') {
        sn = '<h1>' + set.name + ' </h1>';
    }
    if (set.descrip != '') {
        sd = '<p>' + set.descrip + '</p>';
    }

    toRet = sn + sd;

    for (ii = 0; ii < set.imgsIndex.length; ii++) {
        toRet += getModalImage(set.imgsIndex[ii]);
    }
    return toRet;
}

function getModalImage(i) {
    //console.log('img requested:' + i);
    let name = '';
    let descrip = '';

    if (getImg(i).name != '') { 
        name = '<h2>' + getImg(i).name + '</h2>';
    }
    if (getImg(i).descrip != '') {
        descrip = '<p>' + getImg(i).descrip + '</p>';
    }

    //TODO get img div - additional parameter add true (is for modal)
    return name + getImgDiv(i, true) + descrip;

}



//===================| Img set processes |========================================================================================
function Range(a, b) {
    //creates list of integers from a to b-1
    const ar = [];
    for (i = a; i < b; i++) {
        ar.push(i);
    }
    return ar;
}

function getOrganised() {
    //get list of all img indecies
    const loi = Range(0, allImgs.length);
    var iToRemove = -1;

    //for all sets of images
    for (si = 0; si < imgSets.length; si++) {
        //for all image indicies within it
        for (j = 0; j < imgSets[si].imgsIndex.length; j++) {
            //check if ii included, if it hasn't been removed, remove it
            iToRemove = loi.indexOf(imgSets[si].imgsIndex[j]);

            if (iToRemove < 0) {
                continue;
            }
            else {
                loi.splice(iToRemove, 1)
            }
        }

        loi.splice(imgSets[si].tnIndex, 0, ("s" + si));
    }

    //add i to not set
    addI(loi);

    return loi;
}
function addI(loi) {
    for (k = 0; k < loi.length; k++) {
        if (typeof loi[k] == typeof 1) {
            loi[k] = 'i' + loi[k];
        }
        else {
            continue;
        }
    }
}

//img lists - i# and s# - read and output as gallery
function readListString(los) {
    let final = '';
    let num = -1;
    let s = 'not';

    for (i =los.length-1; i >= 0 ; i--) {
        s = los[i];

        if (s.includes('s')) {
            num = Number(s.slice(1, s.length));
            final += getSetGalleryDiv(num);
        }
        else if (s.includes('i')) {
            num = Number(s.slice(1, s.length));
            final += getImgGalleryDiv(num);
        }
    }

    return final;
}

function readListObject(los) {
    const loo = [];
    let num = -1;
    let s = 'not';

    for (i = 0; i < los.length; i++) {
        s = los[i];

        if (s.includes('s')) {
            num = Number(s.slice(1, s.length));
            loo.push(getSet(num));
        }
        else if (s.includes('i')) {
            num = Number(s.slice(1, s.length));
            loo.push(getImg(num));
        }
    }

    return loo;
}


function listToString(los) {
    if (los.length == 0) {
        return '[]';
    }

    l = '"'+los[0]+'"' ;
    for (i = 1; i < los.length; i++) {
        l += ',"'+ los[i]+'"' ;
    }

    return '[' + l + ']';
}


//===================| commision example |===================================================================================
//please use lists of strings that refers to images only

//find top 10 most relevant imgs
function commTopX(finish, size, additionals) {
    //console.log(finish, size, additionals);
    //finish : 0-4
    //size : 1-3
    //additionals: >= 0

    const select = [];

    for (i = 0; i < commExamples.length; i++) {
        ind = determineIndex(commExamples[i], select, finish, size, additionals);
        select.splice( ind, 0, commExamples[i]);
        //change this number for longer or shorter lists
        select.splice(8, select.length - 8);
    }

    return select.reverse();
}

function determineIndex(str, arr, finish, size, additionals) {
    if (arr.length == 0) {
        return 0;
    }

    //console.log('function called ' + str);

    //the value of the
    rel = determineRelevance(str, finish, size, additionals);
    //value of any array at i
    // determineRelevance(arr[ind], finish, size, additionals);
    s = 0;
    //console.log(s);
    l = arr.length - 1;
    ind = 0;
    aRel = -1000;

    while (Math.abs(l - s) > 1) {
        ind = between(s, l);
        aRel = determineRelevance(arr[ind], finish, size, additionals);

        if (rel == aRel) {
            //console.log('same value found:', rel, determineRelevance(arr[ind], finish, size, additionals));
            return ind;
        }
        else if (aRel> rel ) {
            l = ind;
            //console.log('rel smaller than element at index, large set to ind.')
        }
        else if ( aRel <rel) {
            s = ind;
            //console.log('rel larger than element at index, small set to ind.')
        }
    }

    if (ind == s) {
        ind = l;
    }
    else if (ind == l) {
        ind = s;
    }
    aRel = determineRelevance(arr[ind], finish, size, additionals);
    if (aRel > rel) {
        return ind;
    }
    else {
        return ind + 1;
    }

    console.log('determine idex code broken, returned : ' + s);
    return s;

}
function between(a, b) {
    return Math.ceil((a + b) / 2);
}

function determineRelevance(str, finish, size, additionals) {
    
    var img = getImg(Number(str.slice(1, str.length)));
    //values will be negative if the image has less than requested
    //negatives penalized more than positives

    //change the multiples for different importance
    //console.log('got:', finish, size, additionals);
    //console.log('img:', img.finish, img.size, img.additionals());

    df = (img.finish - finish) * 5;
    ds = (img.size - size) * 1;
    da = (img.additionals() - additionals) * 0.05;

    nn = 0;

    if (df < 0) {
        nn++;
        df *= -1;
    }
    if (ds < 0) {
        nn++;
        ds *= -1;
    }
    if (da < 0) {
        nn++;
        da *= -0.1;

    }
    //console.log("df, ds, da, nn:" , df ,ds , da , nn);

    nn *= 1;

    //console.log("relevance:", df + ds + da + nn);
    return df + ds + da + nn;
}