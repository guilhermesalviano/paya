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
      const folder = result.folderPath.split('/')
      
      if (result) {
        if (folderPathElement) folderPathElement.textContent = `${folder[folder.length-1]}`;
        displayVideos(result.videos);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      alert('Error selecting folder: ' + error);
    }
  });
  
  function displayVideos(videos: VideoFile[]) {
    if (!videoListElement) return;
    console.log('Displaying videos:', videos.length);

    videoListElement.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    videoListElement.className = 'flex flex-nowrap';
    videoListElement.append(...videos.map((video) => createVideoCard(video)));
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

  // Create Video Card
  const createVideoCard = (video: VideoFile): HTMLDivElement => {
    const el = <T extends keyof HTMLElementTagNameMap>(
      tag: T,
      classes?: string,
      text?: string
    ): HTMLElementTagNameMap[T] => {
      const element = document.createElement(tag);
      if (classes) element.className = classes;
      if (text) element.textContent = text;
      return element;
    };

    const videoCard = el('div', 'bg-white rounded-lg shadow overflow-hidden');
    const thumbnailContainer = el('div', 'bg-gray-200 aspect-video flex items-center justify-center');
    const videoIcon = el('div', 'text-gray-500 text-5xl', '🎬');
    const infoContainer = el('div', 'p-4');
    const videoName = el('h3', 'font-medium text-gray-900 mb-1 truncate', video.name);
    const videoType = el('p', 'text-sm text-gray-500', `Type: ${video.type}`);
    const playButton = el('button', 'mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition', 'Play Video');

    playButton.addEventListener('click', () => playVideo(video.path));

    thumbnailContainer.appendChild(videoIcon);
    infoContainer.append(videoName, videoType, playButton);
    videoCard.append(thumbnailContainer, infoContainer);

    return videoCard;
  };

  // Create Video Card
  const createVideoCardFlix = (video: VideoFile): HTMLDivElement => {
    const el = <T extends keyof HTMLElementTagNameMap>(
      tag: T,
      classes?: string,
      text?: string
    ): HTMLElementTagNameMap[T] => {
      const element = document.createElement(tag);
      if (classes) element.className = classes;
      if (text) element.textContent = text;
      return element;
    };

    const videoCard = el('div', 'bg-white rounded-lg shadow overflow-hidden');
    const thumbnailContainer = el('div', 'bg-gray-200 aspect-video flex items-center justify-center');
    const videoIcon = el('div', 'text-gray-500 text-5xl', '🎬');
    const infoContainer = el('div', 'p-4');
    const videoName = el('h3', 'font-medium text-gray-900 mb-1 truncate', video.name);
    const videoType = el('p', 'text-sm text-gray-500', `Type: ${video.type}`);
    const playButton = el('button', 'mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition', 'Play Video');

    playButton.addEventListener('click', () => playVideo(video.path));

    thumbnailContainer.appendChild(videoIcon);
    infoContainer.append(videoName, videoType, playButton);
    videoCard.append(thumbnailContainer, infoContainer);

    return videoCard;
  };
});