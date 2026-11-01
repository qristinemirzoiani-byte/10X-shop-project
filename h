[33mcommit 71490f54d1b9a88dd7be87cc53992a0b73d8fcce[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: qristinemirzoiani-byte <qristinemirzoiani@gmail.com>
Date:   Sun Nov 1 23:37:18 2026 +0100

    refactor: extract header components
    
    Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

 src/components/AuthActions.tsx  |  40 [32m++++[m[31m--[m
 src/components/CartButton.tsx   |  63 [32m+++++++++[m
 src/components/DesktopNav.tsx   |   5 [32m+[m[31m-[m
 src/components/MobileDrawer.tsx |  26 [32m+++[m[31m-[m
 src/components/ThemeToggle.tsx  |  32 [32m+++++[m
 src/layout/Header.tsx           | 307 [32m++++[m[31m------------------------------------[m
 6 files changed, 175 insertions(+), 298 deletions(-)
