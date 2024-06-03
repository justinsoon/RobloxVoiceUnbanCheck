// ==UserScript==
// @name         Ban Countdown Roblox Voice
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fetch JSON data from Roblox Voice Settings, extract the Unix timestamp, and display both relative time and exact date with timezone.
// @match        https://voice.roblox.com/v1/settings
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let banner;

    // Function to fetch JSON data from the specified URL
    async function fetchData() {
        try {
            const response = await fetch(window.location.href);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            processJsonData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to process the JSON data
    function processJsonData(data) {
        // Extract the "Seconds" value from the "bannedUntil" property
        const unixTimestamp = data.bannedUntil.Seconds;

        // Create the banner if it doesn't exist
        if (!banner) {
            banner = document.createElement('div');
            banner.style.position = 'fixed';
            banner.style.bottom = '1000px';
            banner.style.left = '10px';
            banner.style.padding = '20px';
            banner.style.backgroundColor = 'yellow';
            banner.style.color = 'black';
            banner.style.fontSize = '30px';
            banner.style.fontWeight = 'bold';
            banner.style.zIndex = 1000;
            document.body.appendChild(banner);
        }

        // Update the banner every second
        setInterval(() => {
            updateBanner(unixTimestamp);
        }, 1000);

        // Initial update
        updateBanner(unixTimestamp);
    }

    // Function to update the banner with relative time and exact date
    function updateBanner(banEndTime) {
        // Get the current time
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Calculate the difference
        const timeDifference = banEndTime - currentTime;

        // Convert the difference to a readable relative time
        const readableTime = getRelativeTime(timeDifference);

        // Convert Unix timestamp to a readable date and time
        const date = new Date(banEndTime * 1000);
        const readableDate = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

        // Get the user's local timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Update the banner text
        banner.textContent = `Voice ban ends ${readableTime} at ${readableDate} - ${timezone}`;
    }

    // Function to convert time difference to a human-readable relative time format
    function getRelativeTime(seconds) {
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return `in ${count} ${interval.label}${count !== 1 ? 's' : ''}`;
            }
        }

        return 'soon';
    }

    // Call the fetchData function to start the process
    fetchData();
})();
