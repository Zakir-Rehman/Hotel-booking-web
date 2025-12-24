// (() => {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(form => {
//     form.addEventListener('submit', event => {
//       if (!form.checkValidity()) {
//         event.preventDefault()
//         event.stopPropagation()
//       }

//       form.classList.add('was-validated')
//     }, false)
//   })
// })()
function indexEJS() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(".images-db",
    {
      // y: -100,
      // opacity: 0.5,
      // scale: 0.2,
      filter: "blur(20px)",

    },
    {
      // y: 0,
      // opacity: 1,
      // duration: 1.5,
      // ease: "power2.out",
      filter: "blur(0px)",
      stagger: 0.3
      // scale: 1
    }
  );
  // gsap.fromTo(".single-card",
  //   {
  //    scale:0,
  //    y:-200
  //   },
  //   {
  //     y:0,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: ".cards-main-div",   // jese hi index-div viewport me aaye
  //       start: "top top",
  //       marker:true,
  //       scale:1,
  //       pin:true,
  //       scrub:2,
  //       markers: true   
  //     }
  //   }
  // );
  // let tl = gsap.timeline()
  // gsap.fromTo(".card", {
  //   y: -100,
  //   scale: 0.1,
  //   opacity: 0

  // }, {
  //   // opacity: 1,
  //   scale: 1,
  //   opacity: 1,
  //   y: 0,
  //   stagger: 0.3,
  //   // scrollTrigger: {
  //   //   trigger: ".cards-main-div",   // jese hi index-div viewport me aaye
  //   //   end: "bottom bottom",
  //   //   start: "top top",
  //   //   marker: true,
  //   //   // scale: 1,
  //   //   // pin: true,
  //   //   // scrub: true,
  //   // }

  // })
  // tl.from(".card", {
  //   x: -1000,
  //   scale: 0.2,
  //   opacity: 0.5,
  //   stagger: 0.5,
  // })

}
// indexEJS()
// gsap.fromTo('.booking-card',
//   {
//     position: 'relative',
//     // opacity: 0.3,
//     // scale: 0.2
//     //  width:'33%',
//   },
//   {
//     position: 'fixed',
//     top:'20px',
//     right:0,
//     // width:'200px',
//                  // ✅ ye yahan hona chahiye, scrollTrigger ke bahar
//     scrollTrigger: {
//       trigger: ".main-div",  // ye woh element hai jisse animation trigger hogi
//       start: "top top",      // jab .main-div viewport me aaye
//       end: "80% 80%",  // jab viewport ke end tak jaye
//       markers: true,         // ✅ spelling sahi hai 'markers' (plural)
//       scrub: true            // scroll ke sath smoothly chalega
//     }
//   }
// );
// gsap.fromTo('.container',
//   {
//     position: 'relative',
//     // opacity: 0.3,
//     // scale: 0.2
//     //  width:'33%',
//   },
//   {
//     position: 'fixed',
//     top:'20px',
//     right:0,
//     // width:'200px',
//                  // ✅ ye yahan hona chahiye, scrollTrigger ke bahar
//     scrollTrigger: {
//       trigger: ".main-div", 
//       start: "top top",     
//       end: "80% 80%", 
//       markers: true,        
//       scrub: true           
//     }
//   }
// );


// ScrollTrigger:{
//   opacity:1,
//   trigger:'.main-div',
//   position:'fixed',
//   top:0,
//    right:0,
//    start:'top top',
//    scrub:2,
//    pin:true
//   }
// locomotive.js // 
//    const scroll = new LocomotiveScroll({
//     el: document.querySelector("#main"),
//     smooth: true,
//     getDirection: true,
//     // remove this if present:  
//     // showScrollElements: true
// });



// const fab = document.querySelector('.fab-btn');
// const panel = document.querySelector('.fab-panel');

// fab.addEventListener('click', () => {
//   panel.classList.toggle('show');
// });
// function updateOnlineStatus() {
//   const offlineMsg = document.getElementById("offlineMessage");

//   if (!navigator.onLine) {
//     offlineMsg.classList.remove("hidden");
//     offlineMsg.classList.add("animate-slide-down");
//   } else {
//     offlineMsg.classList.add("hidden");
//   }
// }

// window.addEventListener("online", updateOnlineStatus);
// window.addEventListener("offline", updateOnlineStatus);

// // page load check
// updateOnlineStatus();