typedef int (*Comparator)(const void *, const void *);

void func_0020FEEC(void *base, int size, int count, Comparator compare);

void func_002101DC(void *base, int count, int size, Comparator compare)
{
    func_0020FEEC(base, size, count, compare);
}
