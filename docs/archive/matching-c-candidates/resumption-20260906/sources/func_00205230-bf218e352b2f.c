extern int func_00205608(int, int, int, int *);
int func_00205230(int a, int b)
{
    int data[10];
    int low = 1000;
    int high = -1000;
    int i = 0;
    while (func_00205608(a, b, i, data)) {
        if (data[2] < low) low = data[2];
        if (high < data[2] + data[4]) high = data[2] + data[4];
        i++;
    }
    if (high - low < 0) return 0;
    return high - low;
}
