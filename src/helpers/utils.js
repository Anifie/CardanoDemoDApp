import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { logger } from "./logger";
import { delay } from "./misc";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const usePageTitle = (title) => {
    React.useEffect(() => {
        if (title) document.querySelector("title").innerHTML = title;
    }, []);
};

export const patchWeb3Auth = async (title, subtitle, policy) => {
    for (let i = 0; i < 10; i++) {
        try {
            const ele = document.querySelector("button[title='Google'] p");
            ele.innerText = "Google";
            if (title) {
                const ele = document.querySelector(".w3a-header__title");
                ele.innerText = title;
            }
            if (subtitle) {
                const ele = document.querySelector(".w3a-header__subtitle");
                ele.classList.remove("w3a-header__subtitle");
                ele.classList.add("w3a-header__subtitle_og");
                ele.innerText = subtitle;
            }
            if (policy) {
                const ele = document.querySelector(".w3a-social__policy");
                ele.innerText = policy;
            }
        } catch (e) {
            logger("error patch..skipping");
        }
        await delay(100);
    }
};
export const silentWeb3Auth = async (web3Auth) => {
    for (let i = 0; i < 30; i++) {
        try {
            const ele = document.querySelector("#w3a-modal");
            ele.innerHTML = "";
        } catch (e) {
            logger("cannot close modal");
        }
        await delay(10);
    }
    try {
        web3Auth.loginModal.closeModal();
    } catch (e) {
        logger("cannot close modal");
    }
};