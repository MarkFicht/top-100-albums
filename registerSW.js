if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/top-100-albums/sw.js', { scope: '/top-100-albums/' })})}