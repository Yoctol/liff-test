function url(scheme, version, registerFrom) {
  let liffid = {
    lineLogin: process.env.LINE_LOGIN_LIFF_ID,
    messagingApi: process.env.MESSAGING_API_LIFF_ID,
  };

  let url = {
    line: `line://app/${liffid[registerFrom]}?scheme=${scheme}&version=${version}&registerFrom=${registerFrom}`,
    https: `https://liff.line.me/${liffid[registerFrom]}/${version}?scheme=${scheme}&version=${version}&registerFrom=${registerFrom}`,
  };
  return url[scheme];
}

function button(scheme, version, registerFrom) {
  return {
    type: 'text',
    text: url(scheme, version, registerFrom),
    size: 'xs',
    decoration: 'underline',
    wrap: true,
    action: {
      type: 'uri',
      label: 'action',
      uri: url(scheme, version, registerFrom),
    },
    margin: 'sm',
  };
}

function title(scheme, version, registerFrom) {
  return {
    type: 'text',
    text: `${scheme} ${version} ${registerFrom}`,
    size: 'sm',
    weight: 'bold',
    margin: 'lg',
  };
}

module.exports = async function App(context) {
  const text = 'LIFF 測試連結：';
  const bubble = {
    type: 'bubble',
    size: 'giga',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          weight: 'bold',
          size: 'md',
          text: text,
          wrap: true,
        },
        title('line', 'v1', 'lineLogin'),
        button('line', 'v1', 'lineLogin'),

        title('line', 'v1', 'messagingApi'),
        button('line', 'v1', 'messagingApi'),

        title('line', 'v2', 'lineLogin'),
        button('line', 'v2', 'lineLogin'),

        title('line', 'v2', 'messagingApi'),
        button('line', 'v2', 'messagingApi'),

        title('https', 'v1', 'lineLogin'),
        button('https', 'v1', 'lineLogin'),

        title('https', 'v1', 'messagingApi'),
        button('https', 'v1', 'messagingApi'),

        title('https', 'v2', 'lineLogin'),
        button('https', 'v2', 'lineLogin'),

        title('https', 'v2', 'messagingApi'),
        button('https', 'v2', 'messagingApi'),
      ],
    },
  };
  await context.sendFlex(text, bubble);
};
