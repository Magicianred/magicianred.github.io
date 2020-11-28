document.addEventListener("DOMContentLoaded", () => {

  const startButton = document.querySelector("#pomodo-start");
  const stopButton = document.querySelector("#pomodo-stop");
  const audioSwitchButton = document.querySelector("#audio-switch");
  
  const audioOnIcon = document.querySelector("#audio-on-icon");
  const audioOffIcon = document.querySelector("#audio-off-icon");

  let isClockRunning = false;
  // 25 mins
  let workSessionDuration = 1500;
  let currentTimeLeftInSession = 1500;

  // 5 mins;
  let breakSessionDuration = 300;

  let timeSpentInCurrentSession = 0;
  const TypesEnum = {
    WORK: 'Work',
    BREAK: 'Break'
  }
  let currentType = TypesEnum.WORK;

  let currentTaskLabel = document.querySelector("#pomodo-clock-task");

  let updatedWorkSessionDuration;
  let updatedBreakSessionDuration;

  let workDurationInput = document.querySelector("#input-work-duration");
  let breakDurationInput = document.querySelector("#input-break-duration");

  workDurationInput.value = "25";
  breakDurationInput.value = "5";

  let isClockStopped = true;

  const progressBar = new ProgressBar.Circle("#pomodo-timer", {
    color: '#212121',
    strokeWidth: 6,
    text: {
      value: "25:00"
    },
    trailColor: "#f4f4f4",
    trailWidth: 1,
    easing: 'easeInOut',
    svgStyle: null
  });

  // Start
  startButton.addEventListener("click", () => {
    toggleClock();
  });

  // Stop
  stopButton.addEventListener("click", () => {
    toggleClock(true);
  });

  // Audio properties
  let audioStatus = false;
  const soundBell = new Audio('./sounds/328825_4877562-lq.mp3');
  const soundBellBreak = new Audio('./sounds/377639_7003434-lq.mp3');
  const soundTimer = new Audio('./sounds/32937_29541-lq.mp3');

  if(audioSwitchButton) {
    audioStatus = true;
    audioSwitchButton.addEventListener("click", () => {
      toggleAudioSwitch();
    });
  }


  workDurationInput.addEventListener("input", () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value);
  });


  breakDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value);
  });

  const minuteToSeconds = mins => {
    return mins * 60;
  };

  const toggleClock = reset => {
    togglePlayPauseIcon(reset);
    if (reset) {
      soundTimer.pause();
      stopClock();
    } else {
      if (isClockStopped) {
        setUpdatedTimers();
        isClockStopped = false;
      }

      if (isClockRunning === true) {
        // pause
        soundTimer.pause();
        clearInterval(clockTimer);
        isClockRunning = false;
      } else {
        // start
        soundTimer.loop = true;
        audioStatus ? soundTimer.play() : null;
        clockTimer = setInterval(() => {
          stepDown();
          displayCurrentTimeLeftInSession();
          progressBar.set(calculateSessionProgress());
        }, 1000);
        isClockRunning = true;
      }
      showStopIcon();
    }
  };

  const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = "";
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    function addLeadingZeroes(time) {
      return time < 10 ? `0${time}` : time;
    }
    if (hours > 0) result += `${hours}:`;
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    progressBar.text.innerText = result.toString();

    let textToDisplay = 'PomoDo (' + result.toString() +')';
    if (currentType == TypesEnum.BREAK) {
      textToDisplay += ' BREAK';
    }
    displayInTitleBar(textToDisplay);
  };

  const displayInTitleBar = textToDisplay => {
    document.title = textToDisplay;
  }

  const stopClock = () => {
    displayInTitleBar('PomoDo');
    setUpdatedTimers();
    displaySessionLog(currentType);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    currentType = TypesEnum.WORK;
    timeSpentInCurrentSession = 0;
    currentTaskLabel.disabled = false;
  };

  const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
      currentTimeLeftInSession--;
      timeSpentInCurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
      if (currentType === TypesEnum.WORK) {
        audioStatus ? soundBell.play() : null;
        currentTimeLeftInSession = breakSessionDuration;
        displaySessionLog(TypesEnum.WORK);
        currentType = TypesEnum.BREAK;
        setUpdatedTimers();
        // new
        currentTaskLabel.value = $('.i18n-break').text();
        currentTaskLabel.disabled = true;
      } else {
        audioStatus ? soundBellBreak.play() : null;
        currentTimeLeftInSession = workSessionDuration;
        currentType = TypesEnum.WORK;
        setUpdatedTimers();
        // new
        if (currentTaskLabel.value === $('.i18n-break').text()) {
          currentTaskLabel.value = workSessionLabel;
        }
        currentTaskLabel.disabled = false;
        displaySessionLog(TypesEnum.BREAK);
      }
      timeSpentInCurrentSession = 0;
    }
    displayCurrentTimeLeftInSession();
  };

  const displaySessionLog = type => {
    const sessionsList = document.querySelector("#pomodo-sessions");
    const li = document.createElement("li");
    if (currentType === TypesEnum.WORK) {
      sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : $('.i18n-work').text();
      workSessionLabel = sessionLabel;
    } else {
      sessionLabel = $('.i18n-break').text();
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1";

    const text = document.createTextNode(
      `${sessionLabel} : ${elapsedTime} min`
    );
    li.appendChild(text);
    sessionsList.appendChild(li);
  };

  const setUpdatedTimers = () => {
    if (currentType === TypesEnum.WORK) {
      currentTimeLeftInSession = updatedWorkSessionDuration
      ? updatedWorkSessionDuration
      : workSessionDuration;
      workSessionDuration = currentTimeLeftInSession;
    } else {
      currentTimeLeftInSession = updatedBreakSessionDuration
      ? updatedBreakSessionDuration
      : breakSessionDuration;
      breakSessionDuration = currentTimeLeftInSession;
    }
  };

  const toggleAudioSwitch = () => {
    audioStatus = !audioStatus;
    if (audioStatus) {
      if (!audioOffIcon.classList.contains("hidden")) {
        audioOffIcon.classList.add("hidden");
      }
      audioOnIcon.classList.remove("hidden");
      if (isClockRunning) {
          soundTimer.play();
      }
    } else {
      if (!audioOnIcon.classList.contains("hidden")) {
        audioOnIcon.classList.add("hidden");
      }
      audioOffIcon.classList.remove("hidden");
      soundTimer.pause();
      soundBell.pause();
    }
  };

  const togglePlayPauseIcon = reset => {
    const playIcon = document.querySelector("#play-icon");
    const pauseIcon = document.querySelector("#pause-icon");
    if (reset) {
      if (playIcon.classList.contains("hidden")) {
        playIcon.classList.remove("hidden");
      }
      if (!pauseIcon.classList.contains("hidden")) {
        pauseIcon.classList.add("hidden");
      }
    } else {
      playIcon.classList.toggle("hidden");
      pauseIcon.classList.toggle("hidden");
    }
  };

  const showStopIcon = () => {
    const stopButton = document.querySelector("#pomodo-stop");
    stopButton.classList.remove("hidden");
  };

  const calculateSessionProgress = () => {
    const sessionDuration =
    currentType === TypesEnum.WORK ? workSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 10;
  };

});
