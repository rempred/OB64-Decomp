/* Independently reconstructed from the complete ROM 1EAF0 body. */
#include "common/audio_filter.h"

void func_0001eaf0(L4Filter *filter, L4Pull pull, L4ParamAddress param,
                   int field10)
{
    filter->input = 0;
    filter->pull = pull;
    filter->param = param;
    filter->field0c = 0;
    filter->field0e = 0;
    filter->field10 = field10;
}
