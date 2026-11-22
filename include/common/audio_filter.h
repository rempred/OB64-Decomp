#ifndef OB64_COMMON_AUDIO_FILTER_H
#define OB64_COMMON_AUDIO_FILTER_H

typedef struct L4Command {
    unsigned int word0, word1;
} L4Command;

typedef struct L4Filter L4Filter;
typedef L4Command *(*L4Pull)(void *, short *, int, int, L4Command *);

/* The +0x08 slot stores the callback address. Each consumer converts it
 * back to the installed function's type before invoking it. */
typedef void (*L4ParamAddress)(void);
typedef int (*L4EnvelopeParam)(void *, int, void *);
typedef int (*L4ResampleParam)(L4Filter *, int, void *);
typedef void (*L4LoadParam)(void *, int, void *);

struct L4Filter {
    L4Filter *input;
    L4Pull pull;
    L4ParamAddress param;
    short field0c, field0e;
    int field10;
};

typedef struct L4Param L4Param;
struct L4Param {
    L4Param *next;
    int time;
    short type, field0a;
    union {
        struct { int value, time; } general;
        struct {
            int pitch;
            short volume;
            unsigned char pan, effect;
            int samples;
            void *wave;
        } start;
        void *pointer;
    } data;
};

typedef struct L4Envelope {
    L4Filter filter;
    void *state;
    short pan, volume, left, right, dry, wet;
    unsigned short leftFraction;
    short leftRate, leftTarget;
    unsigned short rightFraction;
    short rightRate, rightTarget;
    int elapsed, duration, first;
    L4Param *head, *tail;
    int field44, playing, field4c;
} L4Envelope;

typedef struct L4Resample {
    L4Filter filter;
    void *state;
    union { float value; int bits; } ratio;
    int field1c;
    float fraction;
    int first, field28, field2c, field30;
} L4Resample;

typedef struct L4Wave L4Wave;
typedef unsigned int (*L4Dma)(unsigned char *, int, void *);
/* The L4 factory is supplied indirectly through the synth configuration. */
typedef void *(*L4DmaConstructor)(int *);

typedef struct L4Load {
    L4Filter filter;
    void *state14, *state18;
    unsigned int loopStart, loopEnd, loopCount;
    L4Wave *wave;
    int bookBytes;
    L4Dma dma;
    int dmaState; /* Passed by address to the factory, then as an opaque word to DMA. */
    unsigned int position;
    int previousSamples, first, field44;
} L4Load;

typedef struct L4Bus {
    L4Filter filter;
    int count, capacity;
    L4Filter **sources;
} L4Bus;

typedef struct L4Save {
    L4Filter filter;
    void *destination;
    int first;
} L4Save;

typedef int (*L4SaveParam)(L4Save *, int, void *);

typedef struct L4Lowpass {
    short cutoff, gain;
    int field04;
    short coefficients[16];
    void *state;
    int first;
} L4Lowpass;

typedef struct L4Delay {
    unsigned int input, output;
    short field08, field0a, field0c, field0e;
    float rate, ratio;
    int field18;
    float depth;
    L4Lowpass *lowpass;
    L4Resample *resample;
} L4Delay;

typedef struct L4Effect L4Effect;
typedef int (*L4EffectParam)(L4Effect *, int, int *);

struct L4Effect {
    L4Filter filter;
    short *buffer, *cursor;
    unsigned int length;
    L4Delay *delays;
    unsigned char count, pad25[3];
    L4EffectParam paramHandler;
};

typedef struct L4EffectSlot {
    L4Bus bus;
    L4Effect effect;
} L4EffectSlot;

typedef struct L4Link {
    struct L4Link *next, *previous;
} L4Link;

typedef struct L4Voice {
    L4Link link;
    int field08;
    L4Filter *filter;
    L4Load load;
    L4Resample resample;
    L4Envelope env;
} L4Voice;

typedef struct L4Client L4Client;
typedef struct L4Synth {
    L4Client *clients;
    L4Link freeVoices, allocatedVoices, lameVoices;
    int nextSample, currentSample;
    void *dmaConstructor;
    void *heap;
    L4Param *freeParams;
    L4Bus *mainBus;
    L4EffectSlot *slots;
    L4Save *save;
    int maxVoices, field40, outputRate, maxBlock;
} L4Synth;

typedef struct L4Config {
    int field00, maxVoices, maxParams, field0c;
    void *dmaConstructor;
    void *heap;
    int outputRate;
    unsigned char fxType, pad1d[3];
    int *effectParams;
} L4Config;

#endif
