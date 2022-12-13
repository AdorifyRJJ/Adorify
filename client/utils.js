function formatSecFromSec(_sec, padding = false) {
    const sec = Math.floor(_sec % 60);
    if (!padding) {
        return sec.toString();
    } else {
        return sec > 9 ? sec.toString() : "0" + sec.toString();
    }
}

function formatMinFromSec(sec, padding = false) {
    const min = Math.floor((sec / 60) % 60);
    if (!padding) {
        return min.toString();
    } else {
        return min > 9 ? min.toString() : "0" + min.toString();
    }
}

function formatHrFromSec(sec, padding = false) {
    const hr = Math.floor(sec / 60 / 60);
    if (!padding) {
        return hr.toString();
    } else {
        return hr > 9 ? hr.toString() : "0" + hr.toString();
    }
}

function getLastXDates(numDays) {
    const nums = Array.from(Array(numDays).keys());
    const today = new Date();
    return nums
        .map((num) =>
            new Date(
                new Date().setDate(today.getDate() - num)
            ).toLocaleDateString()
        )
        .reverse();
}

export { formatSecFromSec, formatMinFromSec, formatHrFromSec, getLastXDates };
