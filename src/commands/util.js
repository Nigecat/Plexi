
module.exports.checkPeanut = function (userID, guild, callback) {
    callback((
        (
            (
                parseInt(userID.split("")[0]) + 1
            ) * (
                parseInt(userID.split("")[1]) + 1
            ) * (
                parseInt(userID.split("")[2]) + 1
            ) * (
                parseInt(userID.split("")[3]) + 1)
        ) / 10 + (
            parseInt(guild.id.split("")[0]) * userID.split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0)
        )
    ) / 10);
}