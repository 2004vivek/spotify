let currentsong = new Audio();
let songs;
let currfolder;
let control_play = document
  .querySelector(".song_control")
  .getElementsByClassName("player")[0];
  function secondsToMinuteSecondFormat(seconds) {
    if(isNaN(seconds)||seconds<0){
      return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds.toFixed(0)).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
  currfolder=folder;
  let a = await fetch(`/${folder}/`);
  let data = await a.text();
  // console.log(data)
  let div = document.createElement("div");
  div.innerHTML = data;
  let ul = div.getElementsByTagName("a");
  // console.log(ul);
  songs = [];
  for (let i = 0; i < ul.length; i++) {
    const element = ul[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }

  }

   //get all the songs
   //   jo mere pass song hai wo song-list ke ul me dal do
   let song_ul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
   song_ul.innerHTML=""
   for (const song of songs){
     song_ul.innerHTML =
       song_ul.innerHTML +
       `<li>
                             <img class="invert" src="../images/music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>Vivek</div>
                             </div>
                             <div class="playnow">
                                 <span class>Play now</span>
                                 <img class="invert" src="../images/play1.svg" alt="ghj">
                             </div>
                         </li>`;
   }

   //add event listener to each song
  let arr = document.querySelector(".song-list").getElementsByTagName("li");
  let array = Array.from(arr);
  console.log(array);
  array.forEach((e) => {
    e.addEventListener("click", () => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);

      console.log(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
   return songs;
}

function playmusic(music,pause=false) {

  // let audio=new Audio("/songs/"+music)
  currentsong.src = `/${currfolder}/` + decodeURI(music);
  if(pause==false){
  currentsong.play();
  control_play.src = "../images/resume.svg";
}
  document.querySelector(".song_info").innerHTML = decodeURI(music);
  document.querySelector(".song_time").innerHTML = "00:00 /00:00";
}

async function getalbum() {
  let a1 = await fetch(`/songs/`);
  let data1 = await a1.text()
  let div = document.createElement("div");
  div.innerHTML = data1;
  console.log(div);
  
 let links= Array.from(div.getElementsByTagName("a"))
 //earlier i have done async function but i have used normal for loop because
 for (let index = 0; index < links.length; index++){
  const e = links[index];
  if(e.href.includes("/songs/")){
    let folder=e.href.split("/songs/")[1];
    console.log(folder);
    
    //get the meta data of the folder
    let a1 = await fetch(`/songs/${folder}/details.json`);
    let data1 = await a1.json();
    console.log(data1);
    let spotify_container=document.querySelector(".spotify_container")
    spotify_container.innerHTML=spotify_container.innerHTML+`<div data-folder="${folder}" class="card">
    <div class="plays">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>  
    </div>
    <img src="/songs/${folder}/cover.jpeg" alt="img1">
    <h2>${data1.title}</h2>
    <p>${data1.description}</p>
</div>`
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    card.getElementsByClassName("plays")[0].style.opacity = 1;
  });

  card.addEventListener("mouseleave", (e) => {
    card.getElementsByClassName("plays")[0].style.opacity = 0;
  });
});
  }
 }
  //add the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click",async (e1) => {
      console.log(e1.target,e1.currentTarget.dataset)//heree the target element is img 
      await getSongs(`songs/${e1.currentTarget.dataset.folder}`);
      playmusic(songs[0])
      // console.log(e1.dataset.folder,a)
    }
    )
   });
  
}

(async function main(params) {

  songs = await getSongs("songs/folder1");
 playmusic(songs[0],true)

 //displaying all the album
  getalbum()

 //attach event listener to play,next,previous
 control_play.addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play();
    control_play.src = "../images/resume.svg";
  } else {
    currentsong.pause();
    control_play.src = "../images/play.svg";
  }
});

  //listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".song_time").innerHTML=`${secondsToMinuteSecondFormat(currentsong.currentTime)} / ${secondsToMinuteSecondFormat(currentsong.duration)}`
    document.querySelector(".progress").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
  });

  //add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click",(e) => {
    let per=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".progress").style.left=per+"%";
    currentsong.currentTime=(currentsong.duration*per)/100
  }
  )

  //add event listener to hamburger
 let hamburger= document.querySelector(".hamburger").getElementsByTagName("img")[0]
 hamburger.addEventListener("click",() => {
   document.querySelector(".left").style.left="0"
 }
 )

 //add event listener to close button
 let close=document.querySelector(".close").getElementsByTagName("img")[0]
 close.addEventListener("click",() => {
  document.querySelector(".left").style.left="-120%"
 }
 )

 //add event listener to previous button 
 let previous=document.querySelector(".song_control").firstElementChild
 previous.addEventListener("click",() => {
   console.log("previous button clicked")
   currentsong.pause()
   console.log(currentsong.src.split(`/${currfolder}/`)[1]);
   let idx=songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1])
   if((idx-1)>=0){
    playmusic(songs[idx-1])
   }
   console.log(songs,idx)
   
 }
 )
 let next=document.querySelector(".song_control").lastElementChild
 next.addEventListener("click",() => {
   console.log("next button is clicked");
   console.log(currentsong.src.split(`/${currfolder}/`)[1])
   currentsong.pause()
   let idx1=songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1])
   if((idx1+1)<songs.length){
    playmusic(songs[idx1+1])
   console.log(songs[idx1+1])
   }
   
 }
 )

 //add event listener to volume
 let Volume=document.querySelector(".volume").getElementsByTagName("input")[0]
 Volume.addEventListener("change",(e) => {
   console.log(e,e.target.value);
   currentsong.volume=parseInt(e.target.value)/100
   
 }
 )

 //add hover effect to play 
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    card.getElementsByClassName("plays")[0].style.opacity = 1;
  });

  card.addEventListener("mouseleave", (e) => {
    card.getElementsByClassName("plays")[0].style.opacity = 0;
  });
});
  //add the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click",async (e1) => {
      console.log(e1.target,e1.currentTarget.dataset)//heree the target element is img 
      await getSongs(`songs/${e1.currentTarget.dataset.folder}`);
      // console.log(e1.dataset.folder,a)
    }
    )
   });

   //add event listener to mute sound
   let volume=document.querySelector(".volume").firstElementChild
   volume.addEventListener("click",(e) => {
    console.log(e.target.src);
    
    if(e.target.src.includes("volume.svg")){
      currentsong.volume=0
      e.target.src=e.target.src.replace("volume.svg","muted.svg")
      document.querySelector(".volume").getElementsByTagName("input")[0].value=0
    }
    else{
      currentsong.volume=1
      e.target.src=e.target.src.replace("muted.svg","volume.svg")
      document.querySelector(".volume").getElementsByTagName("input")[0].value=10
    }
   })
})();
