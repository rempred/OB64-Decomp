#include "game/nu_si_message.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
extern NUCallBackList *D_800A9EA0;
u32 osSetIntMask(u32 mask);
void func_0001b530(NUCallBackList *list) {
    NUCallBackList **siCallBackListPtr;
    s32 cnt;
    u32 mask;
    siCallBackListPtr = &D_800A9EA0;
    while (*siCallBackListPtr) {
        if ((*siCallBackListPtr)->majorNo == list->majorNo) {
            return;
        }
        siCallBackListPtr = &(*siCallBackListPtr)->next;
    }
    for (cnt = 1; list->func[cnt] != ((void *)0); cnt++) {
    }
    mask = osSetIntMask(1);
    *siCallBackListPtr = list;
    list->next = ((void *)0);
    list->funcNum = cnt;
    osSetIntMask(mask);
}
