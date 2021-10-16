module.exports = {
    ifeq(a, b, options) {//user._id is of type  object
        return a.toString() == b ? options.fn(this) : options.inverse(this);
    }
};