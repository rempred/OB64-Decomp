#ifndef OB64_COMMON_FORMAT_RECORD_H
#define OB64_COMMON_FORMAT_RECORD_H

/* Integer and floating formatters operate on the same caller-owned record.
 * Preserve the union halfword view and trailing qualifier used by _Printf. */
typedef union FormatValue {
    long long s;
    unsigned long long u;
    double d;
    unsigned short h[4];
} FormatValue;

typedef struct FormatRecord {
    FormatValue value;
    signed char *buffer;
    int n0, nz0, n1, nz1, n2, nz2;
    int precision, width;
    unsigned int count;
    int flags;
    signed char qualifier;
} FormatRecord;

void func_0002ba70(FormatRecord *record, signed char code);
void func_0002bcc0(FormatRecord *record, signed char code);
#endif
