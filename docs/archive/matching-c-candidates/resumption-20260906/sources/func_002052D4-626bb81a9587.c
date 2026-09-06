extern int func_00205608(int, int, int, int *);
int func_002052D4(int a, int b)
{
    int data[10];
    int low = 1000;
    int high = -1000;
    int i = 0;
    while (func_00205608(a, b, i, data)) {
        if (data[1] < low) low = data[1];
        if (high < data[1] + data[3]) high = data[1] + data[3];
        i++;
    }
    if (high - low < 0) return 0;
    return high - low;
}
