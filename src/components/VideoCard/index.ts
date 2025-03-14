interface VideoFile {
  name: string;
  path: string;
  type: string;
}

export const createVideoCard = (video: VideoFile, playVideo: (path: string) => void) => {
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