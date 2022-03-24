export interface Pattern<T = string>
extends Iterable<T> {};

export interface PatternAsync<T = string>
extends AsyncIterable<T>{};
