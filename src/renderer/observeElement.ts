// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default (selector: string, callback: Function, continuous = false) => {
    let elementExists = false;
    let timer: NodeJS.Timeout | null = null;

    try {
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element && !elementExists) {
                elementExists = true;
                callback();
                if (!continuous && timer !== null) {
                    clearInterval(timer);
                }
            } else if (!element) {
                elementExists = false;
            }
        };

        timer = setInterval(checkElement, 100);

        // 添加一个外部函数来确保定时器能够被清理
        const cleanup = () => {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        };

        // 尝试执行回调，并确保定时器清理
        try {
            checkElement();
        } catch (error) {
            console.error('Error executing callback:', error);
            cleanup();
        }

    } catch (error) {
        console.error('Error in main function:', error);
    }
}