const WAIT_TIME = 4;
let pageState = window.appState;


function pageInit() {
  pageState = {
    isPlayingAudio: false,
    currentOption: 0,
    totalOptions: getNumberOfVoteOptions(),
    selectedOption: null
  }

  document.addEventListener('keydown', e => handleKeyPress(e), true );
  document.addEventListener('play', e => handleStartOfAudio(e), true);
  document.addEventListener('ended', e => handleEndOfAudio(e), true);
  document.querySelectorAll('[id^=vote-option-]').forEach(element => 
    element.addEventListener('click', e => handleClick(e), true));
  
  startPageRead();

}

function startPageRead() {
  playAudio('vote-heading-audio');
}

function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (audio != null) {
    audio.play();
  } else {
    console.error('Audio file not found for audio ID: ', audioId);
    const e = new Event('ended');
    document.dispatchEvent(e);
  }
}

function playNext(currentOption, totalOptions) {
  if (currentOption < totalOptions) {
    const nextOption = currentOption + 1;
    playAudio('vote-audio-' + nextOption);
    pageState.currentOption = nextOption;
  }
}

function handleStartOfAudio(e) {
  pageState.isPlayingAudio = true;
  console.log(pageState);
}

function handleEndOfAudio(e) {
  window.setTimeout(() => {
    pageState.isPlayingAudio = false;
    playNext(pageState.currentOption, pageState.totalOptions)
  }, WAIT_TIME * 1000);
}

function handleKeyPress(e) {
  if (e.key == 'Enter') {
    if (pageState.isPlayingAudio && pageState.currentOption != 0) {
      selectOption(pageState.currentOption);
    }
  } else if (e.key == 'ArrowUp') {
    // TODO: implement arrowup behaviour
  } else if (e.key == 'ArrowDown') {
    // TODO: implement arrowdown behaviour
  }
}

function handleClick(e) {
  let voteOptionId;
  if (e.target.id.length == 0) {
    voteOptionId = e.target.parentElement.id;
  } else {
    voteOptionId = e.target.id;
  }
  const option = voteOptionId.match('.+-.+-(\\d+)')[1];
  selectOption(option);
}

function selectOption(option) {
  pageState.selectedOption = option;
  const audio = document.getElementById('vote-audio-' + pageState.currentOption);
  if (audio != null) audio.pause();

  const button = document.getElementById('vote-option-' + option);
  const currentText = button.innerText;
  button.innerText = currentText + ' සඳහා ඔබේ ඡන්දය තහවුරු කරන්න';
  button.style.backgroundColor = "green";
  button.style.color = "white";
  playAudio('vote-confirm-audio-' + option);

  window.setTimeout(() => {
    if (!confirm(currentText + ' සඳහා ඔබේ ඡන්දය ලබා දී ඇත')) {
      window.location.reload()
    } else {
      window.location.href = 'endVote.html';
    };
  }, 1);
}

function getNumberOfVoteOptions() {
  return document.querySelectorAll('[id^=vote-option-]').length;
}
