/* Independently authored diagnostic: two distinct prefixes, shared call tail. */
extern int trace_prefix_a(int);
extern int trace_prefix_b(int);
extern int trace_tail(int);
int func_002158E4(int selector, int value)
{
    int result;
    if (selector) {
        result = trace_prefix_a(value);
        result = trace_tail(result);
    } else {
        result = trace_prefix_b(value);
        result = trace_tail(result);
    }
    return result + 7;
}
