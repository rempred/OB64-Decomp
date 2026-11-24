typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef struct {
    s32 a;
    u8 key;
    u8 pad[3];
    s32 c;
} SortRec;
void func_00159A90(SortRec *list, s16 n) {
    s16 i;
    s16 j;
    SortRec tmp;
    u8 key;
    for (i = 1; i < n; i++) {
        key = list[i].key;
        tmp = list[i];
        for (j = i - 1; j >= 0 && key < list[j].key; j--) {
            list[j + 1] = list[j];
        }
        list[j + 1] = tmp;
    }
}
