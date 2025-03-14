// Use the window context to access electron in the browser environment
const { ipcRenderer } = window.require('electron');

interface VideoFile {
  name: string;
  path: string;
  type: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const selectFolderBtn = document.getElementById('selectFolder');
  const folderPathElement = document.getElementById('folderPath');
  const videoListElement = document.getElementById('videoList');
  const videoPlayerElement = document.getElementById('videoPlayer');
  const playerElement = document.getElementById('player') as HTMLVideoElement;
  const closePlayerBtn = document.getElementById('closePlayer');
  
  console.log('DOM loaded, setting up event listeners');
  
  selectFolderBtn?.addEventListener('click', async () => {
    console.log('Select folder button clicked');
    try {
      const result = await ipcRenderer.invoke('select-folder');
      console.log('Folder selection result:', result);
      
      if (result) {
        if (folderPathElement) folderPathElement.textContent = `Folder: ${result.folderPath}`;
        displayVideos(result.videos);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      alert('Error selecting folder: ' + error);
    }
  });
  
  function displayVideos(videos: VideoFile[]) {
    if (!videoListElement) return;
    videoListElement.innerHTML = '';
    console.log('Displaying videos:', videos.length);
    
    videos.forEach(video => {
      const videoCard = document.createElement('div');
      videoCard.className = 'bg-white rounded-lg shadow overflow-hidden';
      
      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.className = 'bg-gray-200 aspect-video flex items-center justify-center';
      
      const videoIcon = document.createElement('div');
      videoIcon.className = 'text-gray-500 text-5xl';
      videoIcon.innerHTML = '🎬';
      
      thumbnailContainer.appendChild(videoIcon);
      
      const infoContainer = document.createElement('div');
      infoContainer.className = 'p-4';
      
      const videoName = document.createElement('h3');
      videoName.className = 'font-medium text-gray-900 mb-1 truncate';
      videoName.textContent = video.name;
      
      const videoType = document.createElement('p');
      videoType.className = 'text-sm text-gray-500';
      videoType.textContent = `Type: ${video.type}`;
      
      infoContainer.appendChild(videoName);
      infoContainer.appendChild(videoType);
      
      const playButton = document.createElement('button');
      playButton.className = 'mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition';
      playButton.textContent = 'Play Video';
      playButton.addEventListener('click', () => {
        playVideo(video.path);
      });
      
      infoContainer.appendChild(playButton);
      
      videoCard.appendChild(thumbnailContainer);
      videoCard.appendChild(infoContainer);
      
      videoListElement.appendChild(videoCard);
    });
  }
  
  function playVideo(path: string) {
    console.log('Playing video:', path);
    if (!playerElement || !videoPlayerElement) return;
    
    playerElement.src = `file://${path}`;
    videoPlayerElement.classList.remove('hidden');
    playerElement.play();
  }
  
  closePlayerBtn?.addEventListener('click', () => {
    if (!playerElement || !videoPlayerElement) return;
    
    playerElement.pause();
    playerElement.src = '';
    videoPlayerElement.classList.add('hidden');
  });
});