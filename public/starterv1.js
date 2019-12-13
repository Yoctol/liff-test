window.onload = function() {
  if (liff) {
    initializeLiff();
  } else {
    document.getElementById('liffAppContent').classList.add('hidden');
    document.getElementById('liffInitErrorMessage').classList.remove('hidden');
  }
};

/**
 * Initialize LIFF
 */
function initializeLiff() {
  liff.init(
    data => {
      // Now you can call LIFF API
      const userId = data.context.userId;
      initializeApp();
    },
    err => {
      // LIFF initialization failed
      alert(`error: ${JSON.stringify(err)}`);
      document.getElementById('liffAppContent').classList.add('hidden');
      document
        .getElementById('liffInitErrorMessage')
        .classList.remove('hidden');
    }
  );
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  document.getElementById('console').textContent = `location.href = ${location.href}

params= ${JSON.stringify(params)}`;
  registerButtonHandlers();
}

/**
 * Register event handlers for the buttons displayed in the app
 */
function registerButtonHandlers() {
  // openWindow call
  document
    .getElementById('openWindowButton')
    .addEventListener('click', function() {
      alert('clicked: openWindow');
      liff.openWindow({
        url: `${rootPath}/external`,
        external: false,
      });
    });

  // openWindow call
  document
    .getElementById('openWindowExternalButton')
    .addEventListener('click', function() {
      alert('clicked: openWindowExternal');
      liff.openWindow({
        url: `${rootPath}/external`,
        external: true,
      });
    });

  // closeWindow call
  document
    .getElementById('closeWindowButton')
    .addEventListener('click', function() {
      alert('clicked: closeWindow');
      liff.closeWindow();
    });

  // sendMessages call
  document
    .getElementById('sendMessageButton')
    .addEventListener('click', function() {
      alert('clicked: sendMessages');
      liff
        .sendMessages([
          {
            type: 'text',
            text: "You've successfully sent a message! Hooray!",
          },
        ])
        .then(function() {
          window.alert('Message sent');
        })
        .catch(function(error) {
          window.alert('Error sending message: ' + error);
        });
    });

  // get access token
  document
    .getElementById('getAccessToken')
    .addEventListener('click', function() {
      alert('clicked: getAccessToken');
      const accessToken = liff.getAccessToken();
      document.getElementById('accessTokenField').textContent = accessToken;
      toggleAccessToken();
    });

  // get profile call
  document
    .getElementById('getProfileButton')
    .addEventListener('click', function() {
      alert('clicked: getProfile');
      liff
        .getProfile()
        .then(function(profile) {
          document.getElementById('userIdProfileField').textContent =
            profile.userId;
          document.getElementById('displayNameField').textContent =
            profile.displayName;

          const profilePictureDiv = document.getElementById(
            'profilePictureDiv'
          );
          if (profilePictureDiv.firstElementChild) {
            profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
          }
          const img = document.createElement('img');
          img.src = profile.pictureUrl;
          img.alt = 'Profile Picture';
          profilePictureDiv.appendChild(img);

          document.getElementById('statusMessageField').textContent =
            profile.statusMessage;
          toggleProfileData();
        })
        .catch(function(error) {
          window.alert('Error getting profile: ' + error);
        });
    });

  // login call, only when external browser is used
  document
    .getElementById('liffLoginButton')
    .addEventListener('click', function() {
      liff.login();
    });
}

/**
 * Toggle access token data field
 */
function toggleAccessToken() {
  toggleElement('accessTokenData');
}

/**
 * Toggle profile info field
 */
function toggleProfileData() {
  toggleElement('profileInfo');
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = 'none';
  } else {
    elem.style.display = 'block';
  }
}
