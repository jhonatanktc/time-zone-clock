/*
(c) Jhonatan Kelvin Tsan Chang
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://www.mozilla.org/en-US/MPL/2.0/
*/
const turn = Math.PI * 2;
const twentyFourthTurn = Math.PI / 12;
const fourthTurn = Math.PI / 2;
const options = {smallestUnit: 'minute'};

const analogClockElm = document.body.querySelector('#analog-clock');
const faceElm = analogClockElm.querySelector('#face');
const handsElm = analogClockElm.querySelector('#hands');
const digitalClockElm = document.body.querySelector('#digital-clock');

const faceCtx = faceElm.getContext('2d');
faceCtx.strokeStyle = 'rgb(255 255 255)';
faceCtx.fillStyle = 'rgb(255 255 255)';
faceCtx.lineWidth = 7;
faceCtx.textBaseline = 'middle';
faceCtx.textAlign = 'center';

faceCtx.beginPath();
faceCtx.arc(500, 500, 330, 0, turn);
faceCtx.stroke();
faceCtx.beginPath();
faceCtx.arc(500, 500, 270, 0, turn);
faceCtx.stroke();

let number;
for (number = 0; number <= 23; number += 1) {
    faceCtx.beginPath();
    faceCtx.arc(
        500 + 330 * Math.cos(number * twentyFourthTurn),
        500 + 330 * Math.sin(number * twentyFourthTurn),
        7, 0, turn
    );
    faceCtx.stroke();

    faceCtx.font = number % 6 === 0 ? '70px "Noto Sans"' : '42px "Noto Sans"';
    faceCtx.fillText(
        number.toString().padStart(2, '0'),
        500 + 400 * Math.cos(number * twentyFourthTurn - fourthTurn),
        505 + 400 * -Math.sin(number * twentyFourthTurn - fourthTurn)
    );
}

const handsCtx = handsElm.getContext('2d');
handsCtx.strokeStyle = 'rgb(255 255 255)';
handsCtx.fillStyle = 'rgb(255 255 255)';
handsCtx.lineWidth = 7;
handsCtx.lineCap = 'round';
handsCtx.textBaseline = 'middle';
handsCtx.textAlign = 'center';
handsCtx.font = '28px "Noto Sans"';

const update = function() {
    handsCtx.clearRect(0, 0, handsElm.width, handsElm.height);

    const utcNow = Temporal.Now.zonedDateTimeISO('UTC');
    const localNow = Temporal.Now.zonedDateTimeISO();

    let timezone;
    for (timezone = -11; timezone <= 12; timezone += 1) {
        handsCtx.strokeStyle = 'rgb(255 255 255 / 0.35)';
        handsCtx.beginPath();
        handsCtx.moveTo(500, 500);
        handsCtx.lineTo(
            500 + 300 * Math.cos((timezone + utcNow.hour + utcNow.minute / 60) * twentyFourthTurn),
            500 + 300 * -Math.sin((timezone + utcNow.hour + utcNow.minute / 60) * twentyFourthTurn)
        );
        handsCtx.stroke();

        handsCtx.strokeStyle = 'rgb(255 255 255 / 0.7)';
        handsCtx.beginPath();
        handsCtx.moveTo(500, 500);
        handsCtx.lineTo(
            500 + 270 * Math.cos((timezone + utcNow.hour + utcNow.minute / 60 + 0.5) * twentyFourthTurn),
            500 + 270 * -Math.sin((timezone + utcNow.hour + utcNow.minute / 60 + 0.5) * twentyFourthTurn)
        );
        handsCtx.stroke();
    
        handsCtx.fillText(
            `${timezone === 12 ? '±' : (timezone >= 0 ? '+' : '-')}${Math.abs(timezone).toString().padStart(2, '0')}`,
            500 + 240 * Math.cos((timezone + utcNow.hour + utcNow.minute / 60) * twentyFourthTurn - fourthTurn),
            500 + 240 * -Math.sin((timezone + utcNow.hour + utcNow.minute / 60) * twentyFourthTurn - fourthTurn)
        );
    }
    digitalClockElm.textContent = `${utcNow.toString(options)} 週 ${utcNow.dayOfWeek}\n${localNow.toString(options)} 週 ${localNow.dayOfWeek}`;
};

update();
setInterval(update, 60000);
