typedef struct { int v[4]; } Result;
extern Result D_801D03A0;
extern int func_00205608(int, int, int, int *);
Result func_00205378(int a, int b)
{
    int data[10];
    Result result = D_801D03A0;
    int i = 0;
    while (func_00205608(a, b, i, data)) {
        if (data[1] < result.v[0]) result.v[0] = data[1];
        if (data[2] < result.v[1]) result.v[1] = data[2];
        if (result.v[2] < data[1] + data[3]) result.v[2] = data[1] + data[3];
        if (result.v[3] < data[2] + data[4]) result.v[3] = data[2] + data[4];
        i++;
    }
    return result;
}
