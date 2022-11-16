# rtti standard

There are a few operations on rtti objects.

Since TypeScript is bad, there's a question of where these functions belong and
what to name them since there's no multiple dispatch at compile time.

## is (type predicate)

```hs
is :: in -> Guards out
```

### Standard

Type predicates, also known as `is` functions, should be owned by an `rtti<out>`.
This implies that if `in` is anything other than `unknown`, the type predicate's
name becomes `is_from_in`.

```ts
// right
namespace out {
   declare function is(u: unknown): u is out;
   declare function is_from_in(in: in): in is out;
}

// wrong
namespace in {
   // what does this even mean?
   declare function is_to_out(in: in): in is out;
}
```

### Rationale (type guard)

When an `rtti<b>` is declared, it knows what it's super-types are and as such,
it makes no sense for other type `a`s to be able to claim that they are within
type `b`'s super-type.

## assert

```hs
assert :: in -> Asserts out
```

### Standard

Type guards, also known as `assert` functions, are also owned by an `rtti<b>`.

```ts
// right
namespace out {
   declare function assert(u: unknown): asserts u is out;
   declare function assert_from_in(in: in): asserts in is out;
}

// wrong
namespace in {
   // this makes sense but still wrong
   declare function assert_to_out(in: in): asserts in is out;
}
```

### Rationale

The reasons articulated in the type predicate (`is`) section apply broadly to
this section. While `in.assert_to_out` does make sense, `rtti<out>` has a
responsibility to know of it's super-types (which it could reasonably assert
from in the first place). As such, no such responsibility will be taken by
`rtti<in>`.

Besides "responsibility", type predicates and type guards for a type `out`
belong in `out`'s associated `rtti` object for soundness reasons. A developer
should trust that if an assertion to `out` succeeds, the asserted value is
definitely of type `out` and not of it's underlaying invariants; invariant
checking belongs close to a type's definition.

## cast

Casting functions are just Normal Functions (tm) but they hold a special
purpose: converting between data types while still retaining the same conceptual
value.

```hs
cast :: a -> b
cast :: b -> c
```

### Standard

The author (coalpha) wishes that casting functions could be owned by the global
scope AS \[GOD\] INTENDED YOU PIECE OF !! BUT THIS IS \[WEB\]*!#? LAND SO WE
CAN'T HAVE n1ce \[\[THINGS\]\]!! FOR $13.99 TURN YOUR MISERABLE \[LIFE\] AROUND!

```ts
namespace a {
   export declare function cast_to_b(a: a): b;
}
namespace b {
   export declare function cast_from_a(a: a): b;
   export declare function cast_to_c(b: b): c;
}
namespace c {
   export declare function cast_from_b(b: b): c;
}
```

### Rationale

The `from` usage is a lot more defendable for the aforementioned reasons but
on occasion, you do actually want to cast to something "more primitive", per se.
In that case, you have no choice but to use the "to" field as there is no way to
just extend namespaces, unfortunately.

Functions should not be named `cast_from_unknown`, instead name them `cast_from`.

In short, casting is a pain in the \[A$$\] AND IT WE'RE LOSING \[KROMER\] GOD
DAMN IT!
