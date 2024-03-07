



const title=document.querySelector('.songInfo>.title')
const seekbar=document.querySelector(".seekbar")
const circle=document.querySelector(".circle")
const cardContainer=document.querySelector('.cardContainer')
const greenColor="#1fdf64"

let currFolder="party";
//seconds to minutes:seconds format
function timeConversion(seconds){
    if(isNaN(seconds) || seconds<0) return "00:00";
    const min=Math.floor(seconds/60);
    const sec=seconds%60;

    const formatMin=String(min).padStart(2,'0');
    const formatSec=String(sec).padStart(2,'0');
    return `${formatMin}:${formatSec}`;

}

async function displayCard(){
    let a=await fetch('./songs')
    let response=await a.text();
    const div=document.createElement('div')
    div.innerHTML=response
    let arr=Array.from(div.getElementsByTagName('a'));
    let folderList=[]
    arr.forEach(element=>{
        if(element.href.includes('/songs')) folderList.push(element.href.split('songs/')[1].split('/')[0]);
    })
    
        folderList.forEach(async (folder)=>{
            let data=await fetch(`./songs/${folder}/info.json`)
            let res=await data.json()
            cardContainer.innerHTML+=`<div class="card pointer" data-folder=${folder}>
            <div class="cardImage">
                <img src="./songs/${folder}/cover.jpg" alt="">
                <img class="play-button" src="images/play-button.svg" alt="">
            </div>
            <h3>${res.title}</h3>
            <p>${res.description}</p>
        </div>`
        })

    main(folderList[0],false)

}
displayCard()
console.log("two");

async function getSongs(folder){
    currFolder=folder   
    let a = await fetch(`./songs/${folder}/`);
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let songLinks= div.getElementsByTagName("a")
    var songs=[];
    for(var i=0;i<songLinks.length;i++){
        if(songLinks[i].href.endsWith(".mp3")){
        songs.push(songLinks[i].href)
        }
    }
    return songs;

}


// ---XXXX---
// we need to make currSong object global so that eveytime we click on music a new object is not create and multiple songs are not playing
let currSong=new Audio();

function playMusic(track,playCheck){
   
    currSong.src=`./songs/${currFolder}/${track}.mp3`;
    currSong.title=`${track}`
    if(playCheck) currSong.play();
    else currSong.pause();
    //wheneven a new song plays icon should become pause
    play.src='images/pause.svg'
    title.innerHTML=track
}
//new song list after trimming
let newList=[]
async function main(folder,playCheck){
    let songs= await getSongs(folder);
    console.log(songs);

    let ul=document.querySelector(".songsList ul");
    //to remove previous added songs 
    ul.innerHTML='';
    newList=[];
    songs.forEach(element => {
        var el=element.split(`songs/${currFolder}/`)[1].split(".mp3")[0].replaceAll("%20"," ")
        newList.push(el)
        ul.innerHTML+=` <li class="currSongs">
        <img width="39px" class="invert" src="images/music-icon.svg" alt="">
        <span>${el}</span>
        <img width="35px" class="invert" id="plbtn" src="images/play.svg" alt="">
    </li>`
    });
    console.log(newList);



    Array.from(document.querySelector('.songsList').getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',(event)=>{
            
            Array.from(document.querySelector('.songsList').getElementsByTagName("li")).forEach(e=>{
                e.querySelector('img:nth-of-type(2)').src="images/play.svg"
                e.getElementsByTagName('span')[0].style.color="white"
            })
            console.log(event.target.id);
            //making the play and pause btn work
            if(e.getElementsByTagName('span')[0].innerHTML==currSong.title && event.target.id=='plbtn'){
                e.getElementsByTagName('span')[0].style.color=greenColor
                console.log("broo");
                if(currSong.paused) {
                    console.log("ullul");
                    currSong.play();
                    e.querySelector('img:nth-of-type(2)').src="images/pause.svg"
            
                }
                else{
                    currSong.pause()
                    e.querySelector('img:nth-of-type(2)').src="images/play.svg"
            
                }
            }
            else {
                playMusic(e.getElementsByTagName('span')[0].innerHTML,true);
                e.getElementsByTagName('span')[0].style.color="#1fdf64"
                if(e.getElementsByTagName('span')[0].innerHTML==currSong.title){
                
                }
                e.querySelector('img:nth-of-type(2)').src="images/pause.svg"
            }
                
               
        })
    })
 

    //when page loads
    playMusic(newList[0],playCheck)
    volRange.value=10;
    currSong.volume=volRange.value/100
    if(playCheck){
     play.src='images/pause.svg'
     document.querySelector(".currSongs").getElementsByTagName('span')[0].style.color="#1fdf64";
     document.querySelector(".currSongs").querySelector('img:nth-of-type(2)').src="images/pause.svg"
    }
    else play.src='images/play.svg'
}



//button event listener
play.addEventListener('click',(e)=>{
    changeLiIcon();
    if(currSong.paused) {
        currSong.play()
        
        play.src='./images/pause.svg';

    }
    else{
        currSong.pause()
        play.src='./images/play.svg';

    }
})
previous.addEventListener('click',(e)=>{
    var index=newList.indexOf(currSong.title);

    console.log(index);
    const length=newList.length;
    if(index!=0){
    playMusic(newList[(index-1)%length],true)
    changeLiText()
    }
})

next.addEventListener('click',(e)=>{
    var index=newList.indexOf(currSong.title);
    const length=newList.length;
    if(index<length-1) {
    playMusic(newList[(index+1)%length],true)
    changeLiText()
    }
})

function changeLiIcon(){ 
    console.log('something something');
    Array.from(document.querySelector('.songsList').getElementsByTagName("li")).forEach(e=>{
        if(e.getElementsByTagName('span')[0].innerHTML==currSong.title){
            console.log("something");
            e.getElementsByTagName('span')[0].style.color=greenColor
            if(currSong.paused) {
                console.log('paused svg');
                e.querySelector('img:nth-of-type(2)').src="images/pause.svg"
        
            }
            else{
                console.log('play svg');
                e.querySelector('img:nth-of-type(2)').src="images/play.svg"
        
            }
            
            }
        
    })
}
function changeLiText(){ 
    console.log('something something');
    Array.from(document.querySelector('.songsList').getElementsByTagName("li")).forEach(e=>{
        if(e.getElementsByTagName('span')[0].innerHTML==currSong.title){
        e.getElementsByTagName('span')[0].style.color=greenColor;
        e.querySelector('img:nth-of-type(2)').src="images/pause.svg"
        }
        else{
             e.getElementsByTagName('span')[0].style.color="white";
             e.querySelector('img:nth-of-type(2)').src="images/play.svg"
        }
})
        
    
}




//time update function
currSong.addEventListener('timeupdate',()=>{
   var currSec=Math.floor(currSong.currentTime)
   var totalSec=Math.floor(currSong.duration);
   const dura=document.querySelector('.duration');
//    console.log(timeConversion(currSec));
   dura.innerHTML=`${timeConversion(currSec)} / ${timeConversion(totalSec)}`

   circle.style.left=(Number(currSong.currentTime)/Number(currSong.duration))*100+"%"
//    console.log((currSong.currentTime/currSong.duration)*100);
})

//lets make our cicrcle glide
seekbar.addEventListener("click",(e)=>{
    const totalWidth=seekbar.getBoundingClientRect().width
    const clickedWidth=e.offsetX;
    const percentage=(clickedWidth/totalWidth)*100;
    console.log(percentage);
    currSong.currentTime=(currSong.duration/100)*percentage;
    circle.style.left=percentage+"%"
})
const cancel=document.querySelector('.cancel-svg')
//for mobile view sliding the left side
const left=document.querySelector('.left')
const hamburger=document.querySelector(".hamburger")

hamburger.addEventListener("click",()=>{
    console.log('hi');
    left.classList.add("hamburger-effect")
    left.classList.remove("after-hamburger-effect")
    cancel.style.display="block"
})


document.querySelector('.cancel-svg').addEventListener('click',()=>{
    // document.querySelector('.left').style.transform="translateX(-100%)" 
    left.classList.add("after-hamburger-effect")
    left.classList.remove("hamburger-effect")

    cancel.style.display="none"
})

//lets do some work on volume 
const vol=document.querySelector(".volume")





volRange.addEventListener("change",(e)=>{
   const volume=e.target.value
   console.log(volume);
   currSong.volume=volume/100

})

var volImgState=true;
volImg=document.querySelector(".volImg")
volImg.addEventListener("click",(e)=>{
    if(volImgState){
        volImg.src="./images/volume-off.svg"
        currSong.volume=0
        volRange.value=0;
        volImgState=false;
    }
    else{
        volImg.src="./images/volume-high.svg"
        currSong.volume=.3
        volRange.value=30
        volImgState=true;
    }
})

//-------the below will not work as now we are adding cards dynamically 
// document.querySelectorAll(".card").forEach((element)=>{
//     element.addEventListener("click",(e)=>{
//         console.log(element.dataset.folder);
//         currFolder=`${element.dataset.folder}`;
        
//         main(currFolder)
//     })
// })

//----this will work
document.addEventListener('click', (event) => {
    if (event.target.closest('.card')) {
        // Your logic here
        removeCardShadow()
        const card=event.target.closest('.card')
        const folder = card.dataset.folder;
        console.log(card);
        card.classList.add('cardShadow')
        currFolder = folder;
        main(currFolder,true);
    }  
});

function removeCardShadow(){
    const cards=document.querySelectorAll(".card").forEach(e=>{
    e.classList.remove("cardShadow")
    })
}