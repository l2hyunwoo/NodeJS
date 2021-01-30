const relationship = {
    name: 'zero',
    friends: ['zero', 'hero'],
    logFriends: function () {
        var that = this;
        this.friends.forEach(function (friend) {
            console.log(that.name, friend);
        });
    },
};

relationship.logFriends();