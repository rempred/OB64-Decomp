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
void func_0001b5d0(NUCallBackList *list) {
    NUCallBackList **siCallBackListPtr;
    NUCallBackList *siCallBackPtr;
    u32 mask;
    siCallBackListPtr = &D_800A9EA0;
    while (*siCallBackListPtr) {
        siCallBackPtr = (*siCallBackListPtr)->next;
        if (siCallBackPtr == list) {
            mask = osSetIntMask(1);
            (*siCallBackListPtr)->next = siCallBackPtr->next;
            siCallBackPtr->next = ((void *)0);
            osSetIntMask(mask);
            break;
        }
        siCallBackListPtr = &(*siCallBackListPtr)->next;
    }
}
