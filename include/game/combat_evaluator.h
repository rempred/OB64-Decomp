#ifndef OB64_COMBAT_EVALUATOR_H
#define OB64_COMBAT_EVALUATOR_H

typedef struct {
    int field00;
    unsigned short field04;
    short field06, field08, field0A, field0C, field0E, field10;
    unsigned char field12[16];
    signed char field22[16];
    unsigned char field32[4], field36[4], field3A[4], field3E[4], field42[4];
    unsigned char field46, field47;
} Func001F197CState;

int func_001F197C(void *object, Func001F197CState *state, int *out);

#endif
