YUI.add('property', function (Y, NAME) {

/**
Provides the `Y.Property` class, a lightweight facade over ES5's
`Object.defineProperty()` and friends that allows you to use real properties
where you might otherwise have used YUI attributes.

@module property
@main property
**/

/**
`Y.Property` is a lightweight facade over ES5's [`Object.defineProperty()`][1]
and friends that allows you to use real properties where you might otherwise
have used YUI attributes.

Benefits over `Y.Attribute`:

  * In ES5 browsers, `Y.Property` is a very thin facade over native
    functionality. Code weight and performance overhead are minimal.

  * `Y.Property` incurs no custom event overhead by default (since
    `property-base` doesn't even use events), and only minimal overhead when the
    `property-events` module is loaded.

  * `Y.Property` uses real JavaScript properties, not an internal hash. For
    cross-browser support in non-ES5 browsers and to get change events, it's
    best to use the `prop()` method to get and set property values, but you can
    also simply get and set the properties directly if you aren't concerned
    about change events or non-ES5 browsers.

Why you might want to use `Y.Attribute` instead:

  * `Y.Attribute` generally has a richer set of functionality. If you need
    features like object/array cloning, writeOnce/initOnly attributes,
    validators, attribute aggregation in a class hierarchy, etc., then Attribute
    may be a better option for you.

  * `Y.Attribute` behaves exactly the same in all browsers. Since `Y.Property`
    relies on ES5 functionality, it has to use a non-native compatibility shim
    in older browsers, and this compatibility shim can't replicate all the
    native functionality exactly due to language limitations. If perfect support
    for older browsers like IE6-8 is important to you, Attribute may be the way
    to go.

  * Most classes in YUI use `Y.Attribute`, since it's been around forever. It's
    a pretty fundamental part of the YUI infrastructure, and YUI users are used
    to it. `Y.Property` is similar, but not exactly the same. If consistency is
    more important to you than performance, you may want to stick with
    Attribute.

### Example

    YUI().use('property', 'oop', function (Y) {
        // Create a pseudoclassical constructor.
        function MyClass() {
            // Define some properties. These properties will automatically be
            // defined on new instances of MyClass.
            this.defineProperties({
                foo: {value: 'hello!'},

                bar: {
                    value: 'baz',
                    enumerable: true,
                    writable: true
                }
            });
        }

        // Augment MyClass with Y.Property so it can have properties.
        Y.augment(MyClass, Y.Property);

        // Now you can create an instance of MyClass and see the properties you
        // defined.
        var instance = new MyClass();

        console.log(instance.prop('foo')); // => 'hello!'
        console.log(instance.prop('bar')); // => 'baz'
    });

[1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

@class Property
@constructor
@extends Property.Base
**/

function Property() {
    Property.superclass.constructor.call(this);
}

Y.extend(Property, Y.Property.Base, {
    /**
    Gets or sets the value of a property.

    If only a _name_ is given, returns the value of the property with that name,
    or `undefined` if the property has not yet been defined.

    If both a _name_ and a _value_ are given, sets the named property to the
    given value and returns the value that was set.

    When a property is set, this method will also fire a change event with the
    name `propertyName + 'Change'`, where `propertyName` is the name of the
    property that was set. For example, setting the `foo` property will fire an
    event named `fooChange`.

    Note that the returned value and the new value passed to the change event
    may differ from the value passed in if the property has a setter function
    that alters the value.

    @example

        thing.prop('foo'); // Returns the value of thing.foo.
        thing.prop('foo', 'bar'); // Sets thing.foo to 'bar'.

    @method prop
    @param {String} name Property name.
    @param {Any} [value] Value to set.
    @param {Object} [options] Options. Properties of this object will be mixed
        into the event facade of the change event.

        @param {Boolean} [options.silent=false] If `true`, no change event will
            be fired.

    @return {Any} Property value, or `undefined` if the property has not yet
        been defined and no value was set.
    **/
    prop: function (name, value, options) {
        var superFn = Y.Property.Base.prototype.prop,
            prevVal = superFn.call(this, name);

        if (typeof value === 'undefined') {
            return prevVal;
        }

        var newVal = superFn.call(this, name, value, options);

        if ((!options || !options.silent) && newVal !== prevVal) {
            this.fire(name + 'Change', Y.merge(options, {
                newVal      : newVal,
                prevVal     : prevVal,
                propertyName: name
            }));
        }

        return newVal;
    }
});

Y.augment(Property, Y.EventTarget);

Y.Property = Y.mix(Property, Y.Property);


}, '@VERSION@', {"requires": ["event-custom", "oop", "property-base"]});
