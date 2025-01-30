function ENCRYPT(e) {
    function n(e) {
        var t;
        var n = '';
        for (t = 7; t >= 0; t--) {
            n += (e >>> 4 * t & 15).toString(16);
        }
        return n;
    }
    var o;
    var r;
    var i;
    var s;
    var a;
    var c;
    var l;
    var d;
    var u;
    var f = new Array(80);
    var h = 1732584193;
    var w = 4023233417;
    var g = 2562383102;
    var p = 271733878;
    var m = 3285377520;
    var v = (e = function (e) {
        e = e.replace(/\r\n/g, '\n');
        var t = '';
        for (var n = 0; n < e.length; n++) {
            var o = e.charCodeAt(n);
            if (o < 128) {
                t += String.fromCharCode(o);
            } else {
                if (o > 127 && o < 2048) {
                    t += String.fromCharCode(o >> 6 | 192);
                    t += String.fromCharCode(63 & o | 128);
                } else {
                    t += String.fromCharCode(o >> 12 | 224);
                    t += String.fromCharCode(o >> 6 & 63 | 128);
                    t += String.fromCharCode(63 & o | 128);
                }
            }
        }
        return t;
    }(e)).length;
    var y = new Array();
    for (r = 0; r < v - 3; r += 4) {
        i = e.charCodeAt(r) << 24 | e.charCodeAt(r + 1) << 16 | e.charCodeAt(r + 2) << 8 | e.charCodeAt(r + 3);
        y.push(i);
    }
    switch (v % 4) {
    case 0:
        r = 2147483648;
        break;
    case 1:
        r = e.charCodeAt(v - 1) << 24 | 8388608;
        break;
    case 2:
        r = e.charCodeAt(v - 2) << 24 | e.charCodeAt(v - 1) << 16 | 32768;
        break;
    case 3:
        r = e.charCodeAt(v - 3) << 24 | e.charCodeAt(v - 2) << 16 | e.charCodeAt(v - 1) << 8 | 128;
    }
    for (y.push(r); y.length % 16 != 14;) {
        y.push(0);
    }
    y.push(v >>> 29);
    y.push(v << 3 & 4294967295);
    for (o = 0; o < y.length; o += 16) {
        for (r = 0; r < 16; r++) {
            f[r] = y[o + r];
        }
        for (r = 16; r <= 79; r++) {
            f[r] = (f[r - 3] ^ f[r - 8] ^ f[r - 14] ^ f[r - 16]) << 1 | (f[r - 3] ^ f[r - 8] ^ f[r - 14] ^ f[r - 16]) >>> 31;
        }
        s = h;
        a = w;
        c = g;
        l = p;
        d = m;
        for (r = 0; r <= 19; r++) {
            u = (s << 5 | s >>> 27) + (a & c | ~a & l) + d + f[r] + 1518500249 & 4294967295;
            d = l;
            l = c;
            c = a << 30 | a >>> 2;
            a = s;
            s = u;
        }
        for (r = 20; r <= 39; r++) {
            u = (s << 5 | s >>> 27) + (a ^ c ^ l) + d + f[r] + 1859775393 & 4294967295;
            d = l;
            l = c;
            c = a << 30 | a >>> 2;
            a = s;
            s = u;
        }
        for (r = 40; r <= 59; r++) {
            u = (s << 5 | s >>> 27) + (a & c | a & l | c & l) + d + f[r] + 2400959708 & 4294967295;
            d = l;
            l = c;
            c = a << 30 | a >>> 2;
            a = s;
            s = u;
        }
        for (r = 60; r <= 79; r++) {
            u = (s << 5 | s >>> 27) + (a ^ c ^ l) + d + f[r] + 3395469782 & 4294967295;
            d = l;
            l = c;
            c = a << 30 | a >>> 2;
            a = s;
            s = u;
        }
        h = h + s & 4294967295;
        w = w + a & 4294967295;
        g = g + c & 4294967295;
        p = p + l & 4294967295;
        m = m + d & 4294967295;
    }
    return (u = n(h) + n(w) + n(g) + n(p) + n(m)).toLowerCase();
}
function createBlockingRequest(e, t) {
    if (-1 !== t.indexOf('http://') || -1 !== t.indexOf('https://') || 'manifest.json' === t) {
        var n = new XMLHttpRequest();
        n.open(e, t, false);
        return n;
    }
    return null;
}
function createNonBlockingRequest(e, t) {
    if (-1 !== t.indexOf('http://') || -1 !== t.indexOf('https://') || 'manifest.json' === t) {
        var n = new XMLHttpRequest();
        n.open(e, t, true);
        return n;
    }
    return null;
}
function fetchClusterUrl() {
    var e = window.userEmail.split('@')[1];
    var t = createBlockingRequest('get', checkClusterURL + '/crextn/cluster?domain=' + e + '&reasonCode=' + window.clusterFound);
    var n = localStorage.getItem('cluster');
    if (n && 2 == (n = n.split(',')).length) {
        var o;
        if ((o = new Date().getTime() / 1000 - n[1]) < 31536000 && 'UNKNOWN_SCHOOL' != n[0] && 'unknown' != window.ClusterUrl) {
            window.clusterUrl = n[0];
            window.clusterFound = window.clusterStatus.FOUND;
            if ('UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
                if (1 == window.needToReloadTabs) {
                    window.needToReloadTabs = 0;
                    checkAllLoadedTabs();
                }
                latencyCheck();
            } else {
                if ('AVOID_OS' == window.clusterUrl) {
                    window.clusterFound = window.clusterStatus.AVOID_OS;
                }
            }
            getGeolocationStatus();
            return void getFeatureConfig();
        }
        if (o < 3600 && ('UNKNOWN_SCHOOL' == n[0] || 'unknown' == window.ClusterUrl)) {
            window.clusterUrl = n[0];
            return void ('UNKNOWN_SCHOOL' == window.clusterUrl && (window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL));
        }
    }
    t.onreadystatechange = function () {
        if (4 == t.readyState && 200 == t.status) {
            var e = t.responseText.trim();
            window.debugIWF = 0;
            if (-1 !== e.lastIndexOf('_disableIWF')) {
                window.clusterUrl = e.slice(0, e.lastIndexOf('_disableIWF'));
                window.debugIWF = 1;
                localStorage.clear();
            } else {
                if (-1 !== e.lastIndexOf('_updateIWF')) {
                    window.clusterUrl = e.slice(0, e.lastIndexOf('_updateIWF'));
                    window.debugIWF = 2;
                    downloadIWFList();
                    downloadNonCIPA();
                } else {
                    window.clusterUrl = e;
                    localStorage.setItem('cluster', window.clusterUrl + ',' + new Date().getTime() / 1000);
                }
            }
            window.clusterFound = window.clusterStatus.FOUND;
            setupIWF();
            getGeolocationStatus();
            getFeatureConfig();
            if ('UNKNOWN_SCHOOL' != window.clusterUrl) {
                if ('AVOID_OS' != window.clusterUrl) {
                    if ('UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
                        latencyCheck();
                    }
                } else {
                    window.clusterFound = window.clusterStatus.AVOID_OS;
                }
            } else {
                window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL;
            }
        } else {
            window.clusterFound = window.clusterStatus.ERROR;
        }
    };
    try {
        t.send();
    } catch (e) {
        console.log('Send error uc4');
    }
    if (true === forceClusterUrl) {
        window.clusterUrl = DEBUG_clusterUrl;
        window.clusterFound = 1;
        getGeolocationStatus();
        getFeatureConfig();
    }
    setupOrReload();
}
function fetchDNS() {
    domainCheck = checkClusterURL.replace(/http:\/\/|https:\/\//gi, '');
    var e = createBlockingRequest('get', 'https://dns.google.com/resolve?name=' + domainCheck + '&type=A');
    e.onreadystatechange = function () {
        if (200 == e.status) {
            var t = JSON.parse(e.responseText.trim());
            if ('object' == typeof t) {
                if (t.Answer.length >= 2) {
                    window.checkClusterURL = 'https://' + t.Answer[1].data;
                    fetchClusterUrl();
                } else {
                    if (1 == t.Answer.length) {
                        window.checkClusterURL = 'https://' + t.Answer[0].data;
                        fetchClusterUrl();
                    }
                }
            }
        }
    };
    e.send();
}
function fetchUserAPI() {
    chrome.identity.getProfileUserInfo(function (e) {
        var t = e.email;
        if (true === forceUserEmail) {
            t = DEBUG_userEmail;
        }
        if ('' !== t) {
            window.userEmail = t;
            window.userFound = window.userStatus.FOUND;
            fetchClusterUrl();
        } else {
            window.clusterFound = window.clusterStatus.AVOID_OS;
            window.clusterUrl = 'AVOID_OS';
        }
    });
}
function skipCacheAndLogAlways(e, t) {
    return -1 != e.indexOf('twitter.com') ? 1 : -1 != e.indexOf('facebook.com') ? 1 : -1 != e.indexOf('google.co') && -1 == e.indexOf('mail.google.co') && -1 == e.indexOf('drive.google.co') ? 1 : -1 != e.indexOf('bing.co') ? 1 : -1 != e.indexOf('search.yahoo.co') ? 1 : -1 != e.indexOf('wikipedia.org') ? 1 : -1 != e.indexOf('youtube.co') ? 1 : 0;
}
function isBlockingInProgress(e, t) {
    return new Promise(function (n, o) {
        chrome.tabs.get(e, function (e) {
            if (e && 'loading' == e.status) {
                var o = new URL(t).hostname;
                if (-1 != o.indexOf('securly.com') || -1 != o.indexOf('iheobagjkfklnlikgihanlhcddjoihkg')) {
                    return void n(true);
                }
                if (undefined !== e.pendingUrl && (-1 != (o = new URL(e.pendingUrl).hostname).indexOf('securly.com') || -1 != o.indexOf('iheobagjkfklnlikgihanlhcddjoihkg'))) {
                    return void n(true);
                }
            }
            n(false);
        });
    });
}
function getLocation(e) {
    var t = document.createElement('a');
    t.href = e;
    return t;
}
function interceptOrNot(e) {
    var t = 0;
    var n = e.type;
    var o = e.url;
    var r = getLocation(o).hostname;
    var i = getLocation(o).pathname;
    if (window.clusterFound == window.clusterStatus.AVOID_OS || 'AVOID_OS' == window.clusterUrl || 'UNKNOWN_SCHOOL' == window.clusterUrl) {
        return t = 0;
    }
    if (0 === e.url.indexOf('file')) {
        return 0;
    }
    var s = o.replace(/^https?\:\/\//i, '');
    var a = (s = s.replace(/^www\.\b/i, '')).length;
    if ('/' === s.charAt(a - 1)) {
        s = s.slice(0, -1);
    }
    var c = ENCRYPT(s);
    if (null !== localStorage.getItem(c)) {
        return window.featureConfig.isAwareOnly ? 0 : (takeDenyActionTabs('G', 'BL', '', window.btoa(s), e.tabId), t = 0);
    }
    if (window.failedOpenObj && window.failedOpenObj.isFailedOpen()) {
        if (window.featureConfig.isAwareOnly) {
            return 0;
        }
        if (window.failedOpenObj.isWideOpenMode()) {
            t = 0;
        } else {
            if (0 == r.indexOf('www.')) {
                r = r.substr(4);
            }
            var l = ENCRYPT(r);
            var d = localStorage.getItem('NC:' + l);
            if (!(null == d || 'main_frame' != n && 'sub_frame' != n)) {
                takeToFailedOpenBlockedPage(e.tabId, r, d);
            }
        }
        return t;
    }
    if (-1 == o.indexOf('youtube.com')) {
        o = o.toLowerCase();
    }
    if (-1 != r.indexOf('google.co') && -1 != i.indexOf('/maps/') && -1 != i.indexOf('/place/')) {
        return t = 1;
    }
    if ('main_frame' !== n && 'sub_frame' !== n && 'xmlhttprequest' !== n) {
        return t = 0;
    }
    if (-1 != r.indexOf('securly.com')) {
        t = 0;
        if (-1 != i.indexOf('crextn/debug') && 'xmlhttprequest' != n) {
            var u = getDebugInfo();
            u.sourceFunction = 'interceptOrNot';
            sendDebugInfo(u);
        }
        return t;
    }
    return -1 != r.indexOf('twitter.com') && (-1 != i.indexOf(window.twitterMessageURI) || -1 != i.indexOf('graphql') && -1 != i.indexOf('CreateTweet') || -1 != o.indexOf(window.twitterPrefetchTimestamp) && -1 == e.tabId) && 'xmlhttprequest' == n ? t = 1 : !r.indexOf('facebook.com') || -1 == i.indexOf('updatestatus') && -1 == i.indexOf('webgraphql') && -1 == i.indexOf('api/graphql') || 'xmlhttprequest' != n ? -1 != r.indexOf('google.co') && -1 != i.indexOf('/plusappui/mutate') && 'xmlhttprequest' == n ? t = 1 : -1 != r.indexOf('google.co') ? (t = 0, 'xmlhttprequest' != n && 'main_frame' != n ? t = 0 : -1 != r.indexOf('accounts.google.co') || -1 != r.indexOf('docs.google.co') || -1 != i.indexOf('/calendar/') || -1 != r.indexOf('code.google.co') || -1 != i.indexOf('/cloudprint') || -1 != i.indexOf('/_/chrome/newtab') || -1 != r.indexOf('appengine.google.com') || -1 != i.indexOf('/complete/search') || -1 != i.indexOf('/webhp') ? t = 0 : -1 != r.indexOf('meet.google.co') ? t = 1 : -1 != i.indexOf('/search') || -1 != i.indexOf('/#q') || -1 != r.indexOf('translate.google.co') || -1 != r.indexOf('remotedesktop.google.co') ? t = 1 : -1 != r.indexOf('mail.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('drive.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('sites.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('hangouts.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('plus.google.co') && 'main_frame' == n ? t = 1 : 0) : -1 != r.indexOf('youtube.com') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('youtube.com') && 'sub_frame' == n && -1 != i.indexOf('embed') ? t = 1 : -1 == r.indexOf('youtube.com') || -1 == i.indexOf('watch_fragments_ajax') && -1 == i.indexOf('doubleclick/DARTIframe.html') && -1 == i.indexOf('ad_data_204') && -1 == i.indexOf('annotations_invideo') && -1 == i.indexOf('api/stats/atr') && -1 == i.indexOf('get_video_info') ? -1 != i.indexOf('youtubei/v1/search') || -1 != i.indexOf('youtube.com/results') ? 1 : 'main_frame' != n && 'sub_frame' != n || -1 == r.indexOf('youtube.com') ? -1 != r.indexOf('facebook.com') && 'sub_frame' == n ? t = 0 : -1 != r.indexOf('bing.com') && -1 != i.indexOf('/fd/fb') || -1 != r.indexOf('ssl.bing.com') || -1 != i.indexOf('/passport.aspx') ? t = 0 : -1 != r.indexOf('bing.com') && 'sub_frame' === n ? t = 1 : 'main_frame' == n || 'sub_frame' == n && 1 == window.checkiFrames ? t = 1 : t : -1 != i.indexOf('youtubei/v1/search') ? 1 : '/' == i ? 1 : -1 == i.indexOf('/results') && -1 == i.indexOf('/watch') ? 0 : -1 != o.indexOf('pbj=1') ? 0 : t = 1 : t = 0 : t = 1;
}
function getBlockUrl(e, t, n, o, r) {
    var i = 'domainblockedforuser';
    var s = '';
    if ('GL' == e) {
        i = 'GEO';
    }
    if ('-1' != n) {
        i = 'safesearch';
        s = window.btoa(n);
    }
    var a = '';
    if (!('BL' != t && 'BL_SRCH' != t && 'WL' != t && 'WL_SRCH' != t)) {
        a = t;
    }
    if (!('BL' != t && 'BL_SRCH' != t)) {
        i = 'G' == e ? 'globalblacklist' : 'policyblacklist';
        t = 'BL';
    }
    if (!('WL' != t && 'WL_SRCH' != t)) {
        i = 'whitelistonly';
        t = 'WL';
    }
    if ('BANNED' == t) {
        i = 'banned';
    }
    if ('unknown' != window.clusterUrl) {
        var c = window.atob(o);
        var l = c.substr(c.indexOf('://') + 3);
        o = window.btoa(l);
        var d = '';
        d = window.clusterUrl.replace('/crextn', '') + '/blocked?useremail=' + window.userEmail + '&reason=' + i + '&categoryid=' + t + '&policyid=' + e + '&keyword=' + s + '&url=' + o + '&ver=' + window.version + (1 == r ? '&subFrame=1' : '');
        if (window.geoLat && window.geoLng) {
            d += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        if (a) {
            d += '&listType=' + a;
        }
        return d;
    }
}
function takeDenyActionTabs(e, t, n, o, r, i, s) {
    invalidateSkipListCaching(o, false);
    clearWebCache(o);
    window.brokredRequest = [];
    var a = 'domainblockedforuser';
    var c = '';
    if ('GL' == e) {
        a = 'GEO';
    }
    if ('-1' != n) {
        a = 'safesearch';
        c = window.btoa(n);
    }
    var l = '';
    if (!('BL' != t && 'BL_SRCH' != t && 'WL' != t && 'WL_SRCH' != t)) {
        l = t;
    }
    if (!('BL' != t && 'BL_SRCH' != t)) {
        a = 'G' == e ? 'globalblacklist' : 'policyblacklist';
        t = 'BL';
    }
    if ('BANNED' == t) {
        a = 'banned';
    }
    if (!('WL' != t && 'WL_SRCH' != t)) {
        a = 'whitelistonly';
        t = 'WL';
    }
    if ('unknown' != window.clusterUrl) {
        var d = window.atob(o);
        var u = d.substr(d.indexOf('://') + 3);
        o = window.btoa(u);
        var f = window.clusterUrl.replace('/crextn', '');
        var h = window.userEmail;
        var w = '';
        w = f + '/blocked?useremail=' + h + '&reason=' + a + '&categoryid=' + t + '&policyid=' + e + '&keyword=' + c + '&url=' + o + '&ver=' + window.version + (1 == i ? '&subFrame=1' : '');
        if (window.geoLat && window.geoLng) {
            w += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        if (l) {
            w += '&listType=' + l;
        }
        if (undefined !== s && s) {
            w += '&rebroker=1';
        }
        return void isBlockingInProgress(r, 'http://' + window.atob(o)).then(function (e) {
            if (!e) {
                setBlockedPage(r, w);
            }
        }).catch(function (e) {
            console.log('exception in checking blocking progress', r);
            setBlockedPage(r, w);
        });
    }
}
function setBlockedPage(e, t) {
    if (-1 == e) {
        e = null;
    }
    if (e > 0) {
        window.tabsBeingBlocked[e] = t;
        chrome.tabs.executeScript(e, {
            code: 'window.stop();',
            runAt: 'document_start'
        }, function () {
        });
    }
    chrome.tabs.update(e, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' }, function () {
        chrome.runtime.lastError;
    });
    chrome.tabs.update(e, { url: t }, function () {
        if (chrome.runtime.lastError) {
            console.log('some error while redirecting to blocked page', chrome.runtime.lastError);
            setTimeout(function () {
                chrome.tabs.update(null, { url: t }, function () {
                });
            }, 500);
        }
    });
}
function takeDenyAction(e, t, n) {
    invalidateSkipListCaching(b64url, false);
    clearWebCache(n);
    var o = 'domainblockedforuser';
    if ('0' == e && '-1' == t) {
        return { cancel: true };
    }
    var r = '';
    if (!('BL' != t && 'BL_SRCH' != t && 'WL' != t && 'WL_SRCH' != t)) {
        r = t;
    }
    if (!('BL' != t && 'BL_SRCH' != t)) {
        o = 'G' == e ? 'globalblacklist' : 'policyblacklist';
        t = 'BL';
    }
    if ('BANNED' == t) {
        o = 'banned';
    }
    if ('unknown' == window.clusterUrl) {
        return { cancel: true };
    }
    var i = window.atob(n);
    var s = i.substr(i.indexOf('://') + 3);
    n = window.btoa(s);
    var a = window.clusterUrl.replace('/crextn', '') + '/blocked?useremail=' + window.userEmail + '&reason=' + o + '&categoryid=' + t + '&policyid=' + e + '&url=' + n + '&ver=' + window.version + (1 == window.isSubFrame ? '&subFrame=1' : '');
    if (window.geoLat && window.geoLng) {
        a += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
    }
    if (r) {
        a += '&listType=' + r;
    }
    return { redirectUrl: a };
}
function takeSafeSearchAction(e, t) {
    return -1 != e.indexOf('google.co') && /q=/.test(t) ? -1 === t.indexOf('safe=') && t + '&safe=strict' : -1 != e.indexOf('bing.com') && -1 == t.indexOf('adlt=strict') ? -1 != t.indexOf('?') ? t + '&adlt=strict' : t + '?adlt=strict' : -1 != e.indexOf('search.yahoo.com') && -1 == t.indexOf('vm=r') ? -1 != t.indexOf('?') ? t + '&vm=r' : t + '?vm=r' : t;
}
function takeCreativeCommonImageSearchAction(e) {
    if (-1 !== e.indexOf('google.co') && -1 !== e.indexOf('tbm=isch')) {
        return -1 === e.indexOf('tbs=il:cl') && e + '&tbs=il:cl';
    }
    if (-1 != e.indexOf('bing.com/images/search') && -1 == e.toLowerCase().indexOf('&qft=+filterui:licensetype-any')) {
        return e + '&qft=+filterui:licenseType-Any';
    }
    return -1 != e.indexOf('search.yahoo.com/search/images') && -1 == e.indexOf('&imgl=fmsuc') ? e + '&imgl=fmsuc' : e;
}
function getYtSSRequestHeaders(e, t) {
    if (-1 != e.indexOf('/results') || -1 != e.indexOf('/search') || -1 != e.indexOf('/watch')) {
        var n = '';
        for (var o = 0; o < t.length; ++o) {
            if ('Cookie' === t[o].name) {
                n = t[o].value;
                t.splice(o, 1);
                break;
            }
        }
        if ('' == n) {
            t.push({
                name: 'Cookie',
                value: 'PREF=f2=8000000'
            });
        } else {
            var r = 0;
            var i = n.split('; ');
            for (o = 0; o < i.length; ++o) {
                if (-1 != i[o].indexOf('PREF')) {
                    if (-1 == i[o].indexOf('f2=8000000')) {
                        i[o] += '&f2=8000000';
                    }
                    r = 1;
                }
                if (-1 != i[o].indexOf('SID=')) {
                    i[o] = '';
                }
            }
            if (0 == r) {
                i.push('PREF=f2=8000000');
            }
            var s = '';
            for (o = 0; o < i.length; ++o) {
                s += i[o];
                s += '; ';
            }
            s = s.substring(0, s.length - 2);
            t.push({
                name: 'Cookie',
                value: s
            });
        }
    }
    return t;
}
function getPauseAction(e) {
    invalidateSkipListCaching(e, true);
    clearWebCache(e);
    window.brokredRequest = [];
    return 'unknown' == window.clusterUrl ? { cancel: true } : { redirectUrl: window.clusterUrl.replace('/crextn', '') + '/paused' };
}
function takePauseActionTabs(e, t) {
    var n = getPauseAction(e);
    if (undefined !== n.redirectUrl) {
        var o = n.redirectUrl;
        chrome.tabs.update(t, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' }, r);
        chrome.tabs.update(t, { url: o }, r);
        setTimeout(function () {
            chrome.tabs.update(null, { url: o }, r);
        }, 500);
    }
    function r() {
        chrome.runtime.lastError;
    }
}
function takeToFailedOpenBlockedPage(e, t, n) {
    var o = btoa(t);
    r = [];
    if (0 != (Math.pow(2, 3) & n)) {
        r.push('Pornography');
    }
    if (0 != (Math.pow(2, 4) & n)) {
        r.push('Drugs');
    }
    if (0 != (Math.pow(2, 5) & n)) {
        r.push('Gambling');
    }
    var r = btoa(r.join(', '));
    window.brokredRequest = [];
    chrome.tabs.update(e, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html?site=' + o + '&category=' + r }, function () {
        chrome.runtime.lastError;
    });
}
function checkSkipListCaching(e) {
    var t = '';
    var n = document.createElement('a');
    n.href = e.url;
    var o = n.hostname.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
    var r = Math.floor(Date.now() / 1000);
    var i = Object.keys(window.skipList);
    if (i && -1 != i.indexOf(o)) {
        t = o;
        ttlForDomain = window.skipList[o].ttl;
        lastBrokerCall = window.skipList[o].last_broker_call;
        if (-1 == ttlForDomain) {
            return 0;
        }
        if (r - lastBrokerCall < ttlForDomain) {
            return 0;
        }
    }
    for (var s = 0; s < i.length; s++) {
        if (-1 != i[s].indexOf('*')) {
            if (window.skipList[i[s]].regx.test(e.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''))) {
                t = i[s];
                ttlForDomain = window.skipList[i[s]].ttl;
                lastBrokerCall = window.skipList[i[s]].last_broker_call;
                if (-1 == ttlForDomain) {
                    return 0;
                }
                if (r - lastBrokerCall < ttlForDomain) {
                    return 0;
                }
            }
        }
    }
    if (t.length > 0) {
        window.skipList[t].last_broker_call = r;
    }
    return 1;
}
function invalidateSkipListCaching(e, t) {
    url = window.atob(e);
    var n = Object.keys(window.skipList);
    if (t) {
        for (var o = 0; o < n.length; o++) {
            window.skipList[n[o]].last_broker_call = 0;
        }
    } else {
        var r = document.createElement('a');
        r.href = url;
        var i = r.hostname.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
        if (n && -1 != n.indexOf(i)) {
            window.skipList[i].last_broker_call = 0;
        }
        for (o = 0; o < n.length; o++) {
            if (-1 != n[o].indexOf('*')) {
                if (window.skipList[n[o]].regx.test(url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''))) {
                    window.skipList[n[o]].last_broker_call = 0;
                }
            }
        }
    }
}
function setupOrReload() {
    if (window.userFound == window.userStatus.FOUND && window.clusterFound == window.clusterStatus.FOUND) {
        if ('UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl && 1 == window.needToReloadTabs) {
            window.needToReloadTabs = 0;
            checkAllLoadedTabs();
        }
        setTimeout(function () {
            fetchClusterUrl();
        }, 1800000);
        sessionStorage.clear();
    } else {
        if (window.clusterFound == window.clusterStatus.AVOID_OS) {
            window.needToReloadTabs = 1;
            setTimeout(function () {
                fetchClusterUrl();
            }, 1800000);
            sessionStorage.clear();
        } else {
            console.log('https://www.securly.com/crextn/blocked?useremail=' + window.userEmail + '&reason=notregistered&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + '&ver=' + window.version + '&url=');
            setTimeout(function () {
                fetchClusterUrl();
            }, 1800000);
        }
    }
}
function getGeolocationStatus() {
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var e = createBlockingRequest('get', window.clusterUrl + '/getGeoStatus?userEmail=' + window.userEmail);
        e.onload = function () {
            window.geolocation = parseInt(e.responseText.trim());
            if (window.geolocation) {
                getGeolocation();
                if (null != window.geoIntervalId) {
                    clearInterval(window.geoIntervalId);
                }
                window.geoIntervalId = setInterval(function () {
                    getGeolocation();
                }, 60000);
            }
        };
        try {
            e.send();
        } catch (e) {
            console.log('Geolocation request error.');
        }
    }
}
function getGeolocation() {
    navigator.geolocation.getCurrentPosition(function (e) {
        window.geoLat = e.coords.latitude;
        window.geoLng = e.coords.longitude;
    }, function (e) {
        console.log('Geolocation error occurred. Error code: ' + e.code);
    }, {
        timeout: 30000,
        maximumAge: 300000
    });
}
function getRemoteIPGeo() {
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var e = createBlockingRequest('get', window.clusterUrl + '/getGeoStatus?ip=1');
        e.onload = function () {
            if (e.responseText.trim() != window.geoLastIP) {
                getGeolocation();
                window.geoLastIP = e.responseText.trim();
            }
        };
        try {
            e.send();
        } catch (e) {
            console.log('Geolocation remote IP request error.');
        }
    }
}
function getVersion(e) {
    var t = createBlockingRequest('GET', 'manifest.json');
    t.onload = function (e) {
        var n = JSON.parse(t.responseText);
        window.version = n.version;
    };
    try {
        t.send();
    } catch (e) {
        console.log('Send error u2');
    }
}
function getQueryVariable(e, t) {
    var n = document.createElement('a');
    n.href = e;
    var o = n.search.replace(/\?/, '').split('&');
    for (var r = 0; r < o.length; r++) {
        var i = o[r].split('=');
        if (decodeURIComponent(i[0]) == t) {
            return decodeURIComponent(i[1]);
        }
    }
    return '';
}
function normalizeHostname(e) {
    var t = e;
    if (0 == e.indexOf('www.')) {
        t = e.substr(4);
    } else {
        if (0 == e.indexOf('m.')) {
            t = e.substr(2);
        }
    }
    return t;
}
function extractTranslateHostname(e) {
    var t = 'translate.google.com';
    var n = getQueryVariable(e, 'u');
    if ('' != n) {
        var o = (n = (n = (n = (n = decodeURIComponent(n)).toLowerCase()).replace('http://', '')).replace('https://', '')).indexOf('/');
        t = -1 != o ? n.substr(0, o) : n;
    }
    return t;
}
function sendDebugInfo(e) {
    var t = window.clusterUrl + '/debug';
    var n = new XMLHttpRequest();
    n.open('POST', t);
    n.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    try {
        n.send(JSON.stringify(e));
    } catch (e) {
        console.log('Send error u3');
    }
}
function checkAllLoadedTabs() {
    window.needToReloadTabs = 0;
    chrome.tabs.query({}, function (e) {
        for (var t = 0; t < e.length; t++) {
            if (-1 == e[t].url.indexOf('securly.com')) {
                if (!(-1 == e[t].url.indexOf('http://') && -1 == e[t].url.indexOf('https://'))) {
                    chrome.tabs.reload(e[t].id);
                }
            }
        }
    });
}
function clearWebCache(e) {
    var t = new Date().getTime() - 300000;
    chrome.browsingData.removeCache({ since: t }, function () {
        chrome.runtime.lastError;
    });
    try {
        var n = window.atob(e);
        var o = new URL(n).hostname.replace('www.', '');
        chrome.browsingData.remove({
            origins: [
                'https://' + o,
                'https://www.' + o
            ]
        }, {
            cacheStorage: true,
            fileSystems: true,
            indexedDB: true,
            localStorage: true,
            pluginData: true,
            serviceWorkers: true,
            webSQL: true
        }, function () {
        });
    } catch (t) {
        console.log('Clearing web cache failed. b64Url' + e);
    }
}
function getDebugInfo() {
    var e = {
        clusterUrl: window.clusterUrl,
        userEmail: window.userEmail
    };
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var t = createBlockingRequest('get', window.clusterUrl.replace('crextn', 'app/session'));
        t.onerror = function () {
            e.sessionInfo = 'Network Error';
            console.log(e);
        };
        t.onload = function () {
            e.sessionInfo = t.responseText;
        };
        t.send();
        var n = [
            'http://www.maxim.com',
            'http://www.amazon.com',
            'http://www.google.com',
            'http://www.bing.com',
            'http://search.yahoo.com',
            'http://www.youtube.com',
            'http://mail.google.com',
            'http://plus.google.com',
            'http://www.facebook.com',
            'http://docs.google.com',
            'http://drive.google.com',
            'http://sites.google.com'
        ];
        for (var o = 0; o < n.length; o++) {
            e = getFilteringInfo(n[o], e);
        }
    }
    return e;
}
function getFilteringInfo(e, t) {
    var n = createBlockingRequest('get', siteUrlToBrokerUrl(e));
    n.onerror = function () {
        t[e] = 'Network Error';
    };
    n.onload = function () {
        t[e] = n.responseText.trim();
    };
    n.send();
    return t;
}
function siteUrlToBrokerUrl(e) {
    var t = document.createElement('a');
    t.href = e;
    var n = t.hostname.toLowerCase();
    var o = window.btoa(e);
    return window.geolocation ? window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + n + '&url=' + o + '&msg=&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + '&lat=' + window.geoLat + '&lng=' + window.geoLng : window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + n + '&url=' + o + '&msg=&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound;
}
function selfClusterCheckBeforeBroker() {
    if ('unknown' === window.clusterUrl || window.clusterFound !== window.clusterStatus.FOUND && window.clusterFound !== window.clusterStatus.AVOID_OS) {
        window.needToReloadTabs = 0;
        fetchClusterUrl();
    }
}
function downloadIWFList() {
    localStorage.clear();
    var e = createNonBlockingRequest('get', 'http://cdn1.securly.com/iwf-encode.txt');
    e.onreadystatechange = function () {
        if (4 == e.readyState) {
            if (200 == e.status) {
                String.prototype.replaceAll = function (e, t) {
                    return this.split(e).join(t);
                };
                var t = e.responseText.replaceAll('\r', '').trim().split('\n');
                for (var n = 0; n < t.length; n++) {
                    localStorage.setItem(t[n], '1');
                }
                var o = new Date();
                localStorage.setItem('currIWFTime', o);
            } else {
                console.log('iwf error', e.status);
            }
        }
    };
    e.send();
}
function downloadNonCIPA() {
    var e = createNonBlockingRequest('get', 'http://cdn1.securly.com/non-cipa-encode.txt');
    e.onreadystatechange = function () {
        if (4 == e.readyState) {
            if (200 == e.status) {
                String.prototype.replaceAll = function (e, t) {
                    return this.split(e).join(t);
                };
                var t = e.responseText.replaceAll('\r', '').trim().split('\n');
                for (var n = 0; n < t.length; n++) {
                    var o = t[n].split(',');
                    localStorage.setItem('NC:' + o[0], o[1]);
                }
            } else {
                console.log('non-cipa error', e.status);
            }
        }
    };
    e.send();
}
function downloadPhraseMatch() {
    const e = createNonBlockingRequest('get', 'http://cdn1.securly.com/pmatch.json');
    e.onreadystatechange = function () {
        if (4 == e.readyState) {
            if (200 == e.status) {
                try {
                    const t = CryptoJS.AES.decrypt(e.responseText, 'SeCuRlY@321$').toString(CryptoJS.enc.Utf8);
                    if (t && t.length > 0) {
                        phraseMatchList = JSON.parse(t);
                    }
                } catch (e) {
                    console.error('parse error for phrase match', e);
                }
            } else {
                console.error('download error for phrase match', e.status);
            }
        }
    };
    e.send();
}
function setupIWF() {
    var e = new Date().getTime();
    var t = Date.parse(localStorage.getItem('currIWFTime'));
    if (isNaN(t)) {
        if (isNaN(t) && 0 === window.debugIWF) {
            downloadIWFList();
            downloadNonCIPA();
            downloadPhraseMatch();
        }
    } else {
        if (e - t >= window.IWFTimeout) {
            downloadIWFList();
            downloadNonCIPA();
            downloadPhraseMatch();
        }
    }
}
function myB64Encode(e, t) {
    var n = window.btoa(e).split('');
    for (var o = 0; o < n.length; o++) {
        n[o] = myB64EncodeHelper(n[o], t);
    }
    return n.join('');
}
function myB64EncodeHelper(e, t) {
    var n = e.charCodeAt(0);
    if ('0' <= e && e <= '9') {
        if ((n += t %= 10) > '9'.charCodeAt(0)) {
            n -= 10;
        }
    } else {
        if ('A' <= e && e <= 'Z') {
            if ((n += t %= 26) > 'Z'.charCodeAt(0)) {
                n -= 26;
            }
        } else {
            if ('a' <= e && e <= 'z' && (n += t %= 26) > 'z'.charCodeAt(0)) {
                n -= 26;
            }
        }
    }
    return String.fromCharCode(n);
}
function getCookies() {
    var e = document.cookie.split(';');
    var t = {};
    for (var n = 0; n < e.length; n++) {
        var o = e[n].split('=');
        t[(o[0] + '').trim()] = unescape(o[1]);
    }
    return t;
}
function setCookie(e, t, n) {
    var o = 0;
    if (n) {
        var r = new Date();
        r.setTime(r.getTime() + 60 * n * 60 * 1000);
        o = 'expires=' + r.toUTCString();
    }
    document.cookie = e + '=' + t + ';' + o + ';path=/';
}
function setClassroomCookies() {
    chrome.cookies.getAll({
        domain: 'securly.com',
        name: 'live_session'
    }, function (e) {
        if (e && e.length > 0) {
            setCookie('live_session', e[0].value, 5);
        } else {
            setCookie('live_session', '0', 5);
        }
    });
    chrome.cookies.getAll({
        domain: 'securly.com',
        name: 'classroom_enabled'
    }, function (e) {
        if (e && e.length > 0) {
            setCookie('classroom_enabled', e[0].value, 1440);
        } else {
            setCookie('classroom_enabled', '0', 1440);
        }
    });
}
function setClearCacheCookie(e) {
    var t = new URL(window.clusterUrl).host;
    chrome.cookies.getAll({
        domain: t,
        name: 'crextn_clear_cache_at'
    }, function (t) {
        if (t && t.length > 0) {
            var n = getCookies();
            setCookie('crextn_clear_cache_at', t[0].value);
            console.debug('[setClearCacheCookie]', 'crextn_clear_cache_at cookie updated', t[0].value);
            if (undefined !== n.crextn_clear_cache_at && n.crextn_clear_cache_at != decodeURIComponent(t[0].value)) {
                console.debug('[setClearCacheCookie]', 'session cleared and rebrokering loaded tabs');
                sessionStorage.clear();
                rebrokerLoadedTabs(e);
            }
        }
    });
}
function clearCacheIfTTLExpired() {
    var e = getCookies();
    if (undefined !== e.crextn_clear_cache_at) {
        if (new Date().getTime() >= new Date(e.crextn_clear_cache_at).getTime()) {
            console.debug('[clearCacheIfTTLExpired]', 'session cleared');
            sessionStorage.clear();
        }
    } else {
        console.debug('[clearCacheIfTTLExpired]', 'crextn_clear_cache_at cookie not found');
    }
}
function rebrokerLoadedTabs(e) {
    e = undefined === e ? '' : e;
    chrome.tabs.query({}, function (t) {
        for (var n = 0; n < t.length; n++) {
            if (t[n].id != e && -1 == t[n].url.indexOf('securly.com')) {
                if (!(-1 == t[n].url.indexOf('http://') && -1 == t[n].url.indexOf('https://'))) {
                    t[n].initiator = '';
                    t[n].type = 'main_frame';
                    t[n].method = 'GET';
                    t[n].tabId = t[n].id;
                    onBeforeRequestListener(t[n], true);
                }
            }
        }
    });
}
function doBrokerForClassroom() {
    var e = getCookies();
    if (1 == e.classroom_enabled && undefined !== e.classroom_enabled) {
        if (1 == e.live_session && undefined !== e.live_session) {
            return true;
        }
        var t = Math.floor(Date.now() / 1000);
        return undefined !== e.last_broker_call ? t - e.last_broker_call > 300 : (setCookie('last_broker_call', t, 5), true);
    }
    return false;
}
function latencyPing() {
    var e = Date.now();
    var t = createNonBlockingRequest('get', 'https://' + window.latencyAPI + '/ping');
    t.onreadystatechange = function () {
        if (4 == t.readyState && 200 == t.status) {
            var n = Date.now() - e;
            createNonBlockingRequest('get', 'https://' + window.latencyAPI + '/latency_report?fid=' + window.fid + '&user=' + window.userEmail + '&latency=' + n).send();
        }
    };
    t.send();
}
function latencyCheck() {
    var e = localStorage.getItem('last_latency_check');
    if ((null == e || Math.floor(Date.now() / 1000) - e >= 86400) && 'unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var t = createNonBlockingRequest('get', window.clusterUrl + '/internetQualityFeed?userEmail=' + window.userEmail);
        t.onreadystatechange = function () {
            if (4 == t.readyState) {
                if (200 == t.status) {
                    var e = JSON.parse(t.responseText);
                    if (1 == e.is_active) {
                        window.fid = e.fid;
                        if (window.latencyFrequency !== e.frequency && null !== window.latencyInterval) {
                            clearInterval(window.latencyInterval);
                            window.latencyInterval = null;
                        }
                        window.latencyFrequency = e.frequency;
                        window.latencyAPI = e.api_server;
                        if (null === window.latencyInterval) {
                            window.latencyInterval = setInterval(function () {
                                latencyPing();
                            }, Math.floor(60 * window.latencyFrequency * 1000));
                        }
                    } else {
                        if (null !== window.latencyInterval) {
                            clearInterval(window.latencyInterval);
                            window.latencyInterval = null;
                        }
                    }
                    localStorage.setItem('last_latency_check', Math.floor(Date.now() / 1000));
                } else {
                    localStorage.setItem('last_latency_check', Math.floor(Date.now() / 1000));
                }
            }
        };
        t.send();
    }
}
function downloadConfig() {
    var e = createNonBlockingRequest('get', 'http://cdn1.securly.com/config.json');
    e.onreadystatechange = function () {
        if (200 == e.status && 4 == e.readyState) {
            if (0 == e.responseText.trim().length) {
                return void (window.skipList = []);
            }
            var t = JSON.parse(e.responseText);
            if (t.skiplist) {
                var n = [];
                t.skiplist.forEach(function (e) {
                    var t = Object.keys(e)[0];
                    if (undefined !== t && t.trim().length > 0) {
                        n[t] = {
                            ttl: e[t],
                            last_broker_call: 0
                        };
                        if (-1 != t.indexOf('*')) {
                            var o = t.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                            var r = new RegExp(o);
                            n[t].regx = r;
                        }
                        if (undefined !== window.skipList[t]) {
                            n[t].last_broker_call = window.skipList[t].last_broker_call;
                        }
                    }
                });
                window.skipList = n;
            }
            if (undefined !== t.selfharmlist) {
                window.selfharmlist = t.selfharmlist;
            } else {
                window.selfharmlist = [];
            }
            if (undefined !== t.vectorExpansionRules) {
                window.vectorExpansionRules = t.vectorExpansionRules;
            } else {
                window.vectorExpansionRules = {};
            }
            if (undefined !== t.bullyPhrases) {
                window.bullyPhrases = decryptPhrases(t.bullyPhrases);
            } else {
                window.bullyPhrases = [];
            }
            if (undefined !== t.wlBullyPhrases) {
                window.wlBullyPhrases = decryptPhrases(t.wlBullyPhrases);
            } else {
                window.wlBullyPhrases = [];
            }
            if (undefined !== t.thinkTwiceSites) {
                window.thinkTwiceSites = t.thinkTwiceSites;
            } else {
                window.thinkTwiceSites = [];
            }
            if (undefined !== t.ttl && 1000 * t.ttl != window.currentConfigTTL) {
                window.currentConfigTTL = 1000 * t.ttl;
                updateTTLForCrextnCacheConfig(window.currentConfigTTL);
            } else {
                if (undefined === t.ttl && window.defaultConfigTTL != window.currentConfigTTL) {
                    window.currentConfigTTL = window.defaultConfigTTL;
                    updateTTLForCrextnCacheConfig(window.defaultConfigTTL);
                }
            }
        }
    };
    e.send();
}
function updateTTLForCrextnCacheConfig(e) {
    if (undefined !== window.cacheIntervalId) {
        clearInterval(window.cacheIntervalId);
    }
    window.cacheIntervalId = setInterval(function () {
        downloadConfig();
    }, e);
}
function stripSafeSearchPramas(e) {
    [
        '&safe=active',
        '\\?safe=active',
        '&adlt=strict',
        '\\?adlt=strict',
        '&vm=r',
        '\\?vm=r'
    ].map(function (t) {
        e = e.replace(new RegExp(t + '$'), '');
    });
    return e;
}
function sendSHDataToServer(e, t, n, o) {
    if (window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
        t = window.clusterUrl + '/flaggedSearches?search=' + window.btoa(e) + '&url=' + window.btoa(t) + '&match=' + window.btoa(n) + '&domain=' + window.btoa(o);
        if (window.geolocation) {
            t = t + '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        var r = createNonBlockingRequest('get', t);
        try {
            r.send();
        } catch (e) {
            console.log('Send self harm data failed');
        }
    }
}
function sendSocialPostToServer(e, t, n, o) {
    if (window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
        o = window.clusterUrl + '/socialActivity?msg=' + window.btoa(encodeURIComponent(e)) + '&domain=' + window.btoa(t) + '&context=' + window.btoa(n) + '&url=' + window.btoa(o);
        if (window.geolocation) {
            o = o + '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        var r = createNonBlockingRequest('get', o);
        try {
            r.send();
        } catch (e) {
            console.log('Send social post failed');
        }
    }
}
function removeHTMLTags(e) {
    return null === e || '' === e ? '' : e.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
}
function decryptPhrases(e) {
    var t = [];
    e.forEach(function (e) {
        let n = CryptoJS.AES.decrypt(e, window.thinkTwicePassPhrase).toString(CryptoJS.enc.Utf8);
        if (n && n.length > 0) {
            t.push(n);
        }
    });
    return t;
}
function getFeatureConfig() {
    if (window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
        let e = createNonBlockingRequest('get', window.clusterUrl + '/config');
        e.onreadystatechange = function () {
            if (200 == e.status && 4 == e.readyState) {
                try {
                    let t = JSON.parse(e.responseText);
                    if ('object' == typeof t && t && 1 == t.success) {
                        window.featureConfig = t;
                    } else {
                        console.log('Not able to fetch feature config');
                    }
                } catch (e) {
                    console.log('Not able to fetch feature config');
                }
            }
        };
        e.send();
    }
}
function sendThinkTwiceAnalytics(e, t, n, o, r) {
    if (window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
        let s = createNonBlockingRequest('POST', window.clusterUrl + '/thinktwice');
        s.onreadystatechange = function () {
            if (200 == s.status && 4 == s.readyState) {
                try {
                    let e = JSON.parse(s.responseText);
                    if ('object' == typeof e && e && 1 == e.success) {
                        console.log('Successfully logged think twice analytics');
                    } else {
                        console.log('Failed to log the think twice analytics');
                    }
                } catch (e) {
                    console.log('Failed to log the think twice analytics');
                }
            }
        };
        var i = new FormData();
        i.append('tt_id', e);
        i.append('site', t);
        i.append('action', n);
        i.append('typed_text', o);
        i.append('matched_phrase', r);
        s.send(i);
    }
}
function sendGoogleChatAnalytics(e) {
    if (window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
        var t = new FormData();
        t.append('chatRoomId', e.chatRoomId);
        t.append('chatMembers', JSON.stringify(e.chatMembers));
        t.append('flagged_text', e.flagged_text);
        t.append('matched_phrase', e.matched_phrase);
        t.append('context', JSON.stringify(e.context));
        t.append('score', e.score);
        t.append('confidence', e.confidence);
        t.append('type_detail', e.type_detail);
        const n = createNonBlockingRequest('post', window.clusterUrl + '/gchat?userEmail=' + window.userEmail);
        n.onreadystatechange = function () {
            if (4 == n.readyState && 200 != n.status) {
                console.log('Error while sending chat to server from captured analytics', n.status);
            }
        };
        try {
            n.send(t);
        } catch (e) {
            console.error('Failed to send chat to server from captured analytics', e);
        }
    }
}
function clearBlob() {
    chrome.cookies.getAll({ domain: '.securly.com' }, function (e) {
        for (var t = 0; t < e.length; t++) {
            if (-1 !== e[t].value.indexOf('blob')) {
                chrome.tabs.query({ currentWindow: true }, function (e) {
                    for (var t = 0; t < e.length; t++) {
                        if (-1 !== e[t].url.indexOf('securly.com')) {
                            chrome.tabs.remove(e[t].id);
                        }
                    }
                });
                chrome.cookies.remove({
                    url: 'https://' + e[t].domain + e[t].path,
                    name: e[t].name
                });
            }
        }
    });
}
function getSocialPost(e, t) {
    var n = '';
    var o = '';
    if (-1 != e.url.indexOf('twitter.com') && (-1 != e.url.indexOf(window.twitterMessageURI) || -1 != e.url.indexOf('graphql') && -1 != e.url.indexOf('CreateTweet')) && 'POST' == e.method && 'xmlhttprequest' == e.type) {
        var r = '';
        if (undefined !== e.requestBody.raw) {
            if ('' == (r = extractTweet(o = new TextDecoder().decode(e.requestBody.raw[0].bytes)))) {
                r = extractPost(o, '&status=', '&tagged_users');
            }
            r = r.replaceAll('\n', ' ');
            r = encodeURIComponent(r);
            n = window.btoa(r.toLowerCase());
        } else {
            r = (r = e.requestBody.formData.status[0]).replaceAll('\n', ' ');
            r = encodeURIComponent(r);
            n = window.btoa(r.toLowerCase());
        }
    }
    if (!(-1 == t.indexOf('facebook.com') || -1 == t.indexOf('updatestatus') && -1 == t.indexOf('webgraphql') || 'POST' != e.method || 'xmlhttprequest' != e.type)) {
        o = new TextDecoder().decode(e.requestBody.raw[0].bytes);
        i = (i = extractFBPost(decodeURIComponent(o))).replaceAll('\n', ' ');
        i = encodeURIComponent(i);
        n = window.btoa(i.toLowerCase());
    }
    if (-1 != t.indexOf('facebook.com') && -1 != t.indexOf('api/graphql') && 'POST' == e.method && 'xmlhttprequest' == e.type) {
        var i;
        if (false === (i = extractFBPostV2(e.requestBody.formData))) {
            return i;
        }
        i = i.replaceAll('\n', ' ');
        i = encodeURIComponent(i);
        n = window.btoa(i.toLowerCase());
    }
    if (-1 != t.indexOf('google.co') && -1 != t.indexOf('/PlusAppUi/mutate') && 'POST' == e.method && 'xmlhttprequest' == e.type) {
        var s = '';
        if (undefined !== e.requestBody.raw) {
            s = extractPost(o = new TextDecoder().decode(e.requestBody.raw[0].bytes), 'f.req=%5B%22', '%22%2C%22oz');
            n = window.btoa(decodeURIComponent(s.toLowerCase()));
        } else {
            var a = e.requestBody.formData['f.req'][0];
            if (-1 !== a.indexOf('79255737')) {
                s = extractPost(a, '[[[0,"', '"]]],null');
                console.log(s);
                s = s.replace('%', '%25');
                n = window.btoa(decodeURIComponent(s.toLowerCase()));
            }
        }
    }
    return n;
}
function extractPost(e, t, n) {
    var o = e.indexOf(t) + t.length;
    var r = e.indexOf(n);
    return e.substring(o, r);
}
function extractTweet(e) {
    var t = JSON.parse(e);
    if (t.variables && t.variables.length > 0) {
        var n = JSON.parse(t.variables);
        if (n.tweet_text && n.tweet_text.length > 0) {
            return n.tweet_text;
        }
    }
    return t.variables && Object.keys(t.variables).length > 0 && t.variables.tweet_text && t.variables.tweet_text.length > 0 ? t.variables.tweet_text : '';
}
function extractFBPost(e) {
    var t;
    var n;
    var o;
    n = 0;
    for (o = (t = e.split('&')).length; n < o; n++) {
        if (0 == t[0].indexOf('variables=')) {
            return JSON.parse(t[0].substr(10)).input.message.text;
        }
    }
}
function extractFBPostV2(e) {
    var t = JSON.parse(e.variables);
    try {
        if ('feed' == t.input.composer_type && t.input.message.text) {
            return t.input.message.text;
        }
    } catch (e) {
        return false;
    }
    return false;
}
function getYoutubeSearchURL(e, t) {
    if (undefined !== e.requestBody.raw) {
        var n = new TextDecoder().decode(e.requestBody.raw[0].bytes);
        var o = JSON.parse(n);
        if (undefined !== o.query) {
            t = e.initiator + '/results?search_query=' + o.query;
        }
    }
    return t;
}
function getRespArrTabs(e, t, n, o, r, i = '', s = false, a, c = null, l = false) {
    if (!(undefined !== l && l)) {
        clearCacheIfTTLExpired();
        l = false;
    }
    var d = _getResCode(e, t);
    var u = '';
    if ('notloggedin' == userEmail) {
        return (d = 'DENY:0:-1:-1:-1:-1:-1').split(':');
    }
    if (doBrokerForClassroom()) {
        d = '';
    }
    if (d) {
        if (-1 != d.indexOf('ALLOW') && 0 == (-1 != e.indexOf('twitter.com') ? 1 : -1 != e.indexOf('facebook.com') ? 1 : -1 != e.indexOf('google.co') && -1 == e.indexOf('mail.google.co') && -1 == e.indexOf('drive.google.co') ? 1 : -1 != e.indexOf('bing.co') ? 1 : -1 != e.indexOf('search.yahoo.co') ? 1 : -1 != e.indexOf('wikipedia.org') ? 1 : -1 != e.indexOf('youtube.co') ? 1 : 0)) {
            wellPathWidgBg.triggerWidgetDisplay();
        } else {
            let a = null;
            let h = null;
            let w = null;
            selfClusterCheckBeforeBroker();
            if (null != c) {
                h = c.channelId;
                a = c.videoId;
                w = c.category;
            }
            u = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + e + '&url=' + t + '&msg=' + n + '&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + (s ? '&subframe=1' : '') + ('' != i ? '&frameHost=' + i : '') + (null != h ? '&channelID=' + h : '') + (null != a ? '&videoID=' + a : '') + (null != w ? '&category=' + encodeURIComponent(w) : '') + (s ? '&subframe=1' : '') + ('' != i ? '&frameHost=' + i : '');
            if (l) {
                u += '&rebroker=1';
            }
            if (0 == d.indexOf('SS') && stripSafeSearchPramas(o) == window.lastBrokeredRequest) {
                return d.split(':');
            }
            window.lastBrokeredRequest = o;
            if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
                (f = createNonBlockingRequest('get', u)).onerror = function () {
                    d = 'ERROR:-1:-1:-1:-1:-1:-1';
                };
                f.onload = function () {
                    if (!(undefined !== l && l)) {
                        setClearCacheCookie(r);
                    }
                    wellPathWidgBg.triggerWidgetDisplay();
                    if (0 != (d = f.responseText.trim()).indexOf('FAILED_OPEN:')) {
                        if (-1 == d.toLowerCase().indexOf('<html')) {
                            var n = d.split(':');
                            var o = n[0];
                            var i = n[1];
                            var s = n[2];
                            var a = n[3];
                            var c = n[2];
                            var u = false;
                            if (0 == isNaN(c) && c >= 0) {
                                var h = Long.fromString(c, true).shiftRight(0).toNumber();
                                var w = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
                                if (Long.fromNumber(h).and(Math.pow(2, 36)).shiftRight(0).toNumber() == w) {
                                    u = true;
                                }
                            }
                            if ('DENY' != o && 'PAUSE' != o) {
                                try {
                                    putURLCache(d, t, e, u);
                                } catch (e) {
                                    sessionStorage.clear();
                                }
                            } else {
                                if ('DENY' == o) {
                                    takeDenyActionTabs(i, s, a, t, r, 0, l);
                                } else {
                                    if ('PAUSE' == o) {
                                        takePauseActionTabs(t, r);
                                    }
                                }
                            }
                        }
                    } else {
                        var g = d.split(':');
                        window.failedOpenObj = new FailedOpen(g[1], g[2]);
                    }
                };
                try {
                    f.send();
                } catch (e) {
                }
            } else {
                d = 'ERORR:-1:-1:-1:-1:-1:-1';
            }
        }
    } else {
        let h = null;
        let w = null;
        let g = null;
        selfClusterCheckBeforeBroker();
        if (null != c) {
            w = c.channelId;
            h = c.videoId;
            g = c.category;
        }
        u = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + e + '&url=' + t + '&msg=' + n + '&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + (s ? '&subframe=1' : '') + ('' != i ? '&frameHost=' + i : '') + (null != w ? '&channelID=' + w : '') + (null != h ? '&videoID=' + h : '') + (null != g ? '&category=' + encodeURIComponent(g) : '');
        if (window.geolocation) {
            u = u + '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        if (l) {
            u += '&rebroker=1';
        }
        if (0 == s) {
            if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
                var f = createNonBlockingRequest('get', u);
            }
        } else {
            let t = false;
            if ((-1 != e.indexOf('google.co') && -1 != o.indexOf('/search') || -1 != e.indexOf('bing.com') && -1 != o.indexOf('/search') || -1 != e.indexOf('search.yahoo.com') && -1 != o.indexOf('/search')) && stripSafeSearchPramas(o) == window.lastBrokeredRequest) {
                t = true;
            }
            window.lastBrokeredRequest = o;
            if (!t && 'unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
                var f = createBlockingRequest('get', u);
            }
        }
        if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
            f.onerror = function () {
                d = 'ERROR:-1:-1:-1:-1:-1:-1';
            };
            f.onload = function () {
                if (0 != (d = f.responseText.trim()).indexOf('FAILED_OPEN:')) {
                    if (null != window.failedOpenObj) {
                        window.failedOpenObj = null;
                    }
                    var n = d.split(':')[2];
                    findCrextnBasegene(d);
                    window.checkiFrames = d.split(':')[7];
                    var o = false;
                    if (0 == isNaN(n) && n >= 0) {
                        var c = Long.fromString(n, true).shiftRight(0).toNumber();
                        var u = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
                        if (Long.fromNumber(c).and(Math.pow(2, 36)).shiftRight(0).toNumber() == u) {
                            o = true;
                        }
                    }
                    if (!(undefined !== l && l)) {
                        setClearCacheCookie(r);
                    }
                    wellPathWidgBg.triggerWidgetDisplay();
                    setClassroomCookies();
                    if (-1 == d.indexOf('DENY') && -1 == d.indexOf('PAUSE')) {
                        try {
                            putURLCache(d, t, e, o);
                            setCookie('last_broker_call', Math.floor(Date.now() / 1000), 5);
                        } catch (e) {
                            sessionStorage.clear();
                        }
                    } else {
                        if (0 == d.indexOf('PAUSE')) {
                            takePauseActionTabs(t, r);
                        } else {
                            if (-1 == d.toLowerCase().indexOf('<html')) {
                                var h = d.split(':');
                                h[0];
                                var w = h[1];
                                var g = h[2];
                                var p = h[3];
                                h[4];
                                h[5];
                                h[6];
                                if (0 == s || 0 == window.checkiFrames) {
                                    window.isSubFrame = false;
                                    isSubFrame = false;
                                    takeDenyActionTabs(w, g, p, t, r, isSubFrame, l);
                                } else {
                                    if (1 == window.checkiFrames) {
                                        a.iframeResp = h;
                                        if ('' !== i && window.atob(t) !== i) {
                                            isSubFrame = true;
                                            window.isSubFrame = true;
                                            a.iframeBlockUrl = getBlockUrl(w, g, p, t, isSubFrame);
                                        } else {
                                            window.isSubFrame = false;
                                            isSubFrame = false;
                                            takeDenyActionTabs(w, g, p, t, r, isSubFrame, l);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (window.featureConfig.isAwareOnly) {
                        return;
                    }
                    var m = d.split(':');
                    window.failedOpenObj = new FailedOpen(m[1], m[2]);
                    if (!window.failedOpenObj.isWideOpenMode()) {
                        if (0 == e.indexOf('www.')) {
                            e = e.substr(4);
                        }
                        var v = ENCRYPT(e);
                        var y = localStorage.getItem('NC:' + v);
                        if (null != y) {
                            takeToFailedOpenBlockedPage(r, e, y);
                        }
                    }
                }
            };
            try {
                f.send();
            } catch (e) {
                d = 'ERROR:-1:-1:-1:-1:-1:-1';
            }
        } else {
            d = 'ERROR:-1:-1:-1:-1:-1:-1';
        }
        d = -1 != o.indexOf('google.c') && -1 == o.indexOf('sites.google.com') && -1 == o.indexOf('docs.google.com') && -1 == o.indexOf('drive.google.com') && -1 == o.indexOf('accounts.google.com') && -1 == o.indexOf('calendar.google.com') && -1 == o.indexOf('code.google.com') || -1 != o.indexOf('bing.com') || -1 != o.indexOf('search.yahoo.c') ? 'SS:0:-1:-1:-1:-1:-1' : 'ALLOW:0:-1:-1:-1:-1:-1';
    }
    var h = d.split(':');
    if (undefined === h || null == h || h.length < 7) {
        d = 'ERROR:-1:-1:-1:-1:-1:-1';
        sessionStorage.removeItem(e);
        h = d.split(':');
    }
    return h;
}
function getRespArr(e, t, n, o, r = '', i = false) {
    var s = _getResCode(e, t);
    var a = '';
    if (doBrokerForClassroom()) {
        s = '';
    }
    if (s) {
        wellPathWidgBg.triggerWidgetDisplay();
    } else {
        selfClusterCheckBeforeBroker();
        a = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + e + '&url=' + t + '&msg=' + n + '&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + (i ? '&subframe=1' : '') + ('' != r ? '&frameHost=' + r : '');
        if (window.geolocation) {
            a = a + '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
            var c = createBlockingRequest('get', a);
            c.onerror = function () {
                s = 'ERROR:-1:-1:-1:-1:-1:-1';
            };
            c.onload = function () {
                wellPathWidgBg.triggerWidgetDisplay();
                setClearCacheCookie();
                setClassroomCookies();
                if (0 != (s = c.responseText.trim()).indexOf('FAILED_OPEN:')) {
                    var n = s.split(':')[2];
                    window.checkiFrames = s.split(':')[7];
                    findCrextnBasegene(s);
                    var r = false;
                    if (0 == isNaN(n) && n >= 0) {
                        var i = Long.fromString(n, true).shiftRight(0).toNumber();
                        var a = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
                        if (Long.fromNumber(i).and(Math.pow(2, 36)).shiftRight(0).toNumber() == a) {
                            r = true;
                        }
                    }
                    if (-1 == s.indexOf('DENY') && 0 == (-1 != e.indexOf('twitter.com') ? 1 : -1 != e.indexOf('facebook.com') ? 1 : -1 != e.indexOf('google.co') && -1 == e.indexOf('mail.google.co') && -1 == e.indexOf('drive.google.co') ? 1 : -1 != e.indexOf('bing.co') ? 1 : -1 != e.indexOf('search.yahoo.co') ? 1 : -1 != e.indexOf('wikipedia.org') ? 1 : -1 != e.indexOf('youtube.co') ? 1 : 0)) {
                        try {
                            if (-1 == s.indexOf('WL_URL') || undefined !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0) {
                                if (!(undefined !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0)) {
                                    sessionStorage.setItem(e, s);
                                }
                            } else {
                                sessionStorage.setItem(window.atob(t).replace(/(^\w+:|^)\/\/|(www\.)/, ''), s);
                            }
                            if (0 == r) {
                                if (!(undefined !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0)) {
                                    sessionStorage.setItem(e, s);
                                }
                            }
                            setCookie('last_broker_call', Math.floor(Date.now() / 1000), 5);
                        } catch (e) {
                            sessionStorage.clear();
                        }
                    }
                } else {
                    var l = s.split(':');
                    window.failedOpenObj = new FailedOpen(l[1], l[2]);
                }
            };
            try {
                c.send();
            } catch (e) {
                s = 'ERROR:-1:-1:-1:-1:-1:-1';
            }
        } else {
            s = 'ERROR:-1:-1:-1:-1:-1:-1';
        }
    }
    var l = s.split(':');
    if (undefined === l || null == l || l.length < 7) {
        l = (s = 'ERROR:-1:-1:-1:-1:-1:-1').split(':');
        sessionStorage.removeItem(e);
    }
    return l;
}
function _getResCode(e, t) {
    var n = window.atob(t);
    resultURL = n.replace(/(^\w+:|^)\/\/|(www\.)|(\/$)/, '');
    var o = null;
    var r = sessionStorage.getItem(resultURL);
    if (r) {
        if (2 == (r = r.split(',')).length && new Date().getTime() / 1000 - r[1] < 1800) {
            o = r[0];
        }
    } else {
        o = sessionStorage.getItem(e);
    }
    return o;
}
function putURLCache(e, t, n, o) {
    if (-1 == e.indexOf('WL_URL') || undefined !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0) {
        if (!(0 != o || undefined !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0)) {
            sessionStorage.setItem(n, e + ',' + new Date().getTime() / 1000);
        }
    } else {
        resultURL = window.atob(t).replace(/(^\w+:|^)\/\/|(www\.)/, '');
        sessionStorage.setItem(resultURL, e + ',' + new Date().getTime() / 1000);
    }
}
function findCrextnBasegene(e) {
    if (e.split(':').length >= 9) {
        window.crextnBasegene = Long.fromString(e.split(':')[8], true).shiftRight(0).toNumber();
        window.bit0 = Long.fromNumber(Math.pow(2, 0)).shiftRight(0).toNumber();
        window.crextnBasegene_bit0 = Long.fromNumber(window.crextnBasegene).and(Math.pow(2, 0)).shiftRight(0).toNumber();
    }
}
function setupListener() {
    chrome.tabs.onUpdated.addListener(function (e, t, n) {
        if (undefined !== t.status && -1 != n.url.indexOf('blocked')) {
            if ('complete' != t.status) {
                if (!(-1 == n.url.indexOf('blocked') || -1 == n.url.indexOf('securly.com') && -1 == n.url.indexOf('iheobagjkfklnlikgihanlhcddjoihkg'))) {
                    window.tabsBeingBlocked[e] = n.url;
                }
            } else {
                delete window.tabsBeingBlocked[e];
            }
        } else {
            if (undefined !== t.status && 'complete' == t.status && undefined !== window.tabsBeingBlocked[e]) {
                chrome.tabs.update(e, { url: window.tabsBeingBlocked[e] }, function () {
                });
            }
        }
    });
    chrome.webRequest.onErrorOccurred.addListener(function (e) {
        if ('net::ERR_ABORTED' == e.error && 'main_frame' == e.type && -1 != e.url.indexOf('blocked') && undefined != typeof window.tabsBeingBlocked[e.tabId]) {
            chrome.tabs.update(e.tabId, { url: window.tabsBeingBlocked[e.tabId] }, function (e) {
            });
        }
    }, { urls: ['*://*.securly.com/*'] });
    chrome.webRequest.onBeforeSendHeaders.addListener(function (e) {
        var t = false;
        e.requestHeaders.forEach(function (e) {
            if ('Purpose' == e.name && 'prefetch' == e.value) {
                t = true;
            }
        });
        if (!t) {
            var n = e.url;
            var o = interceptOrNot(e);
            if (1 == o) {
                o = checkSkipListCaching(e);
            }
            if (n.length > 1000) {
                n = n.substring(0, 1000);
            }
            var r = window.btoa(n);
            var i = document.createElement('a');
            i.href = n;
            var s = i.hostname.toLowerCase();
            if (-1 != (s = normalizeHostname(s)).indexOf('google.co') && -1 != s.indexOf('mail.google.co')) {
                var a = _getResCode(s, r);
                if (a) {
                    if ('GM' == (u = a.split(':'))[0]) {
                        e.requestHeaders.push({
                            name: 'X-GoogApps-Allowed-Domains',
                            value: u[4]
                        });
                        return { requestHeaders: e.requestHeaders };
                    }
                }
            }
            if (1 == o) {
                var c = '';
                var l = false;
                if (undefined !== e.initiator) {
                    var d = new URL(e.initiator);
                    c = window.btoa(d.hostname.toLowerCase());
                }
                if ('sub_frame' == e.type) {
                    l = true;
                    window.isSubFrame = true;
                    window.brokredRequest = [];
                } else {
                    window.isSubFrame = false;
                    l = false;
                    window.youtubeFrames = [];
                }
                if (-1 !== n.indexOf('youtube.') && false === window.checkYouTube || -1 === n.indexOf('youtube.') || e.initiator !== window.refDomain) {
                    var u = getRespArr(s, r, '', n, c, l);
                }
                var f = u[0];
                u[1];
                var h = u[2];
                u[3];
                var w = u[4];
                var g = u[4];
                u[5];
                u[6];
                return this.iframeResp.length > 0 && 'DENY' == this.iframeResp[0] ? (this.iframeResp = '', { cancel: true }) : (-1 !== n.indexOf('youtube.') && 'REFWL' == h ? (window.refDomain = e.initiator, window.checkYouTube = false) : -1 !== n.indexOf('youtube.') && (window.checkYouTube = true), 'GM' == f ? (e.requestHeaders.push({
                    name: 'X-GoogApps-Allowed-Domains',
                    value: g
                }), { requestHeaders: e.requestHeaders }) : 'YT' == f ? (2 == w ? e.requestHeaders.push({
                    name: 'YouTube-Restrict',
                    value: 'Strict'
                }) : 1 == w && e.requestHeaders.push({
                    name: 'YouTube-Restrict',
                    value: 'Moderate'
                }), { requestHeaders: e.requestHeaders }) : { requestHeaders: e.requestHeaders });
            }
        }
    }, {
        urls: [
            '*://*.youtube.com/*',
            '*://accounts.google.com/*',
            '*://mail.google.com/*',
            '*://drive.google.com/*'
        ]
    }, [
        'blocking',
        'requestHeaders'
    ]);
    chrome.webRequest.onBeforeRequest.addListener(function (e) {
        return onBeforeRequestListener(e);
    }, { urls: ['<all_urls>'] }, [
        'blocking',
        'requestBody'
    ]);
    chrome.identity.onSignInChanged.addListener(function (e, t) {
        if (true === t) {
            fetchUserAPI();
        }
    });
    chrome.idle.onStateChanged.addListener(function (e) {
        if (lastKnownState != e) {
            if ('active' == e && 'idle' != lastKnownState) {
                sessionStorage.clear();
                if (window.featureConfig && 1 == window.featureConfig.reload_tabs) {
                    rebrokerLoadedTabs();
                } else {
                    chrome.windows.getAll({ populate: true }, function (e) {
                        for (var t = 0; t < e.length; t++) {
                            for (var n = 0; n < e[t].tabs.length; n++) {
                                if ('chrome://' != e[t].tabs[n].url.substring(0, 9)) {
                                    tabCheck.forEach(function (o) {
                                        if (-1 !== e[t].tabs[n].url.indexOf(o)) {
                                            chrome.tabs.reload(e[t].tabs[n].id, { bypassCache: true });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
            lastKnownState = e;
        }
    });
    chrome.runtime.onConnect.addListener(function (e) {
        if ('search_engine_parser' == e.name) {
            e.onMessage.addListener(function (t, n) {
                if ('fetchResult' == t.action && window.selfharmlist.length > 0) {
                    e.postMessage(window.selfharmlist);
                } else {
                    if ('sendSHResult' == t.action) {
                        if (0 == t.msg.length || t.domain + t.msg == window.lastSearch) {
                            return;
                        }
                        window.lastSearch = t.domain + t.msg;
                        sendSHDataToServer(t.msg, t.url, t.matchedTerm, t.domain);
                    }
                }
            });
        } else {
            if ('think_twice' == e.name) {
                e.onMessage.addListener(function (t, n) {
                    if ('fetchThinkTwice' == t.action) {
                        e.postMessage({
                            ...window.featureConfig,
                            ...{
                                bullyPhrases: window.bullyPhrases,
                                wlBullyPhrases: window.wlBullyPhrases,
                                thinkTwiceSites: window.thinkTwiceSites
                            }
                        });
                    } else {
                        if ('sendThinkTwiceAnalytics' == t.action) {
                            sendThinkTwiceAnalytics(t.tt_id, t.site, t.tt_action, t.typedText, t.matchedPhrase);
                        }
                    }
                });
            } else {
                if ('gchat-widget' == e.name) {
                    e.onMessage.addListener(function (t, n) {
                        if ('fetchInitialConfiguration' == t.action) {
                            e.postMessage({
                                action: 'initConfig',
                                phraseMatchList: phraseMatchList,
                                featureConfig: window.featureConfig
                            });
                        } else {
                            if ('sendGoogleChatAnaltics' == t.action) {
                                sendGoogleChatAnalytics(JSON.parse(t.data));
                            }
                        }
                    });
                }
            }
        }
    });
}
function getYTOptions() {
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        toSendUrl = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&url=&ytoptions=true';
        var e = createBlockingRequest('get', toSendUrl);
        e.onload = function () {
            let t = e.responseText.trim();
            window.hideComments = 'true' == t.split(':')[0];
            window.hideThumbnails = 'true' == t.split(':')[1];
            window.hideSidebar = 'true' == t.split(':')[2];
            window.ytOptionsLastCheck = Math.floor(Date.now() / 1000);
        };
        try {
            e.send();
        } catch (e) {
            console.log('getYTOptions Request Failed');
        }
    }
}
function onBeforeRequestListener(e, t = false) {
    var n;
    var o = e.url;
    if ('main_frame' == e.type && -1 == e.url.indexOf('securly') && undefined !== window.tabsBeingBlocked[e.tabId]) {
        return { redirectUrl: window.tabsBeingBlocked[e.tabId] };
    }
    n = o;
    if ('POST' == e.method) {
        interceptPostRequest(e);
    }
    var r = interceptOrNot(e);
    if ('sub_frame' == e.type && 'file://' == e.initiator && 0 === e.url.indexOf('http')) {
        r = 1;
    }
    if (1 == r) {
        r = checkSkipListCaching(e);
    }
    if (1 != r) {
        window.youtubeLastCheck = null;
        if (n.indexOf('youtube')) {
            window.ytURL = n;
            if ('UNKNOWN_SCHOOL' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && (null == window.ytOptionsLastCheck || Math.floor(Date.now() / 1000) - window.ytOptionsLastCheck >= 3600)) {
                getYTOptions();
            }
            chrome.runtime.onConnect.addListener(function (t) {
                if ('yt' == t.name) {
                    t.onMessage.addListener(function (o, r) {
                        if (window.checkYouTube && n.indexOf('youtube') && 'GET' == e.method && 'getYoutubeOptions' != o.action && 'script' !== e.type && 'stylesheet' !== e.type && 'image' !== e.type) {
                            window.youtubeLastCheck = Date.now();
                            if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl && -1 === window.youtubeFrames.indexOf(t.sender.frameId) && (null != o.channelId || null != o.videoId || null != o.category)) {
                                window.youtubeFrames[youtubeFrames.length] = t.sender.frameId;
                                let n = {
                                    channelId: o.channelId,
                                    videoId: o.videoId,
                                    category: o.category
                                };
                                let s = window.btoa(r.sender.url);
                                let a = document.createElement('a');
                                a.href = r.sender.url;
                                c = normalizeHostname(c = a.hostname.toLowerCase());
                                let d = '';
                                if (undefined !== e.initiator) {
                                    var i = new URL(e.initiator);
                                    d = window.btoa(i.hostname.toLowerCase());
                                }
                                let u = getRespArrTabs(c, s, '', r.sender.url, r.sender.tab.id, d, o.embedded, this, n);
                                let f = u[0];
                                let h = u[1];
                                u[2];
                                if ('DENY' == f) {
                                    if (0 == o.embedded) {
                                        chrome.tabs.update(r.sender.tab, takeDenyAction(h, 2, s));
                                    }
                                } else {
                                    if (this.iframeResp.length > 0 && 'DENY' == this.iframeResp[0]) {
                                        this.iframeResp = '';
                                        t.postMessage({
                                            hideRecommended: window.hideRecommended,
                                            hideComments: window.hideComments,
                                            hideSidebar: window.hideSidebar,
                                            hideThumbnails: window.hideThumbnails,
                                            checkEmbed: true,
                                            action: 'deny',
                                            url: this.iframeBlockUrl
                                        });
                                    }
                                }
                            }
                        } else {
                            if ('getYoutubeOptions' == o.action) {
                                t.postMessage({
                                    hideRecommended: window.hideRecommended,
                                    hideComments: window.hideComments,
                                    hideSidebar: window.hideSidebar,
                                    hideThumbnails: window.hideThumbnails
                                });
                            }
                        }
                    });
                }
            });
            chrome.runtime.onConnect.addListener(function (e) {
                if ('gmaps' == e.name) {
                    e.onMessage.addListener(function (e, t) {
                        if (e.url != window.lastMapsUrl) {
                            window.lastMapsUrl = e.url;
                            let n = window.btoa(e.url);
                            let o = document.createElement('a');
                            o.href = e.url;
                            let r = getRespArrTabs(c = normalizeHostname(c = o.hostname.toLowerCase()), n, '', e.url, t.sender.tab.id, '', false, this);
                            let i = r[0];
                            let s = r[1];
                            r[2];
                            if ('DENY' == i) {
                                chrome.tabs.update(t.sender.tab, takeDenyAction(s, 2, n));
                            }
                        }
                    });
                }
            });
        }
    } else {
        var i = '';
        var s = false;
        (l = document.createElement('a')).href = e.initiator;
        i = window.btoa(l.hostname.toLowerCase());
        if ('sub_frame' == e.type) {
            i = window.btoa(l.hostname.toLowerCase());
            s = true;
            window.isSubFrame = true;
            window.brokredRequest = [];
        }
        var a;
        if (n.length > 1000) {
            n = n.substring(0, 1000);
        }
        a = getSocialPost(e, n);
        if (-1 != n.indexOf('youtube.com') && -1 != n.indexOf('youtubei/v1/search')) {
            n = getYoutubeSearchURL(e, n);
        }
        if (false === a) {
            return;
        }
        var c;
        var l;
        var d = window.btoa(n);
        var u = n.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
        if (u.endsWith('/')) {
            u = u.slice(0, -1);
        }
        window.brokeredArrIndex++;
        if (window.brokeredArrIndex >= 20) {
            window.brokeredArrIndex = 0;
        }
        if (!(-1 != window.brokredRequest.indexOf(u) && '' === a)) {
            window.brokredRequest[window.brokeredArrIndex] = u;
        }
        if (-1 != n.indexOf('translate.google.com')) {
            c = extractTranslateHostname(n);
        } else {
            (l = document.createElement('a')).href = n;
            c = l.hostname.toLowerCase();
        }
        c = normalizeHostname(c);
        if (window.geolocation) {
            getRemoteIPGeo();
        }
        if (-1 !== n.indexOf('youtube.') && false === window.checkYouTube || -1 === n.indexOf('youtube.') || e.initiator !== window.refDomain) {
            var f = getRespArrTabs(c, d, a, n, e.tabId, i, s, this, null, t);
        }
        var h = f[0];
        var w = f[1];
        var g = f[2];
        f[3];
        f[4];
        f[5];
        f[6];
        var p = '';
        var m = '';
        if (this.iframeResp.length > 0 && 'DENY' == this.iframeResp[0]) {
            this.iframeResp = '';
            return { redirectUrl: this.iframeBlockUrl };
        }
        if ('DENY' == h) {
            return takeDenyAction(w, g, d);
        }
        if ('PAUSE' == h) {
            return getPauseAction(d);
        }
        var v = false;
        if ('SS' == h) {
            if (false !== (p = -1 != c.indexOf('google.co') && /q=/.test(o) ? -1 === o.indexOf('safe=') && o + '&safe=strict' : -1 != c.indexOf('bing.com') && -1 == o.indexOf('adlt=strict') ? -1 != o.indexOf('?') ? o + '&adlt=strict' : o + '?adlt=strict' : -1 != c.indexOf('search.yahoo.com') && -1 == o.indexOf('vm=r') ? -1 != o.indexOf('?') ? o + '&vm=r' : o + '?vm=r' : o)) {
                o = p;
            }
            v = true;
        }
        if ('CC' == g) {
            if (false !== (m = takeCreativeCommonImageSearchAction(o))) {
                o = m;
            }
            v = true;
        }
        if (-1 !== n.indexOf('youtube.') && 'REFWL' == g) {
            window.refDomain = e.initiator;
            window.checkYouTube = false;
        } else {
            if (-1 !== n.indexOf('youtube.')) {
                window.checkYouTube = true;
            }
        }
        if (true === v) {
            if (-1 !== n.indexOf('google.') && -1 !== n.indexOf('/maps/')) {
                return;
            }
            if (-1 !== n.indexOf('google.')) {
                if (/q=/.test(n)) {
                    if (-1 !== n.indexOf('google.') && -1 === n.indexOf('safe=active') && -1 === n.indexOf('safe=strict')) {
                        return { redirectUrl: o };
                    }
                    if (false === p && false === m) {
                        return;
                    }
                    if (-1 !== n.indexOf('google.') && -1 !== n.indexOf('tbm=isch') && -1 === n.indexOf('tbs=il:cl')) {
                        return { redirectUrl: o };
                    }
                }
            } else {
                if (-1 === n.indexOf('google.com') && -1 !== n.indexOf('yahoo.com') && -1 === n.indexOf('vm=r') || -1 !== n.indexOf('bing.') && -1 === n.indexOf('adlt=strict')) {
                    return { redirectUrl: o };
                }
            }
        }
    }
}
!function (e, t) {
    if ('object' == typeof exports) {
        module.exports = exports = t();
    } else {
        if ('function' == typeof define && define.amd) {
            define([], t);
        } else {
            e.CryptoJS = t();
        }
    }
}(this, function () {
    var t;
    var n;
    var o;
    var r;
    var i;
    var s;
    var a;
    var c;
    var l = l || function (e, t) {
        var n;
        if ('undefined' != typeof window && window.crypto) {
            n = window.crypto;
        }
        if (!n && 'undefined' != typeof window && window.msCrypto) {
            n = window.msCrypto;
        }
        if (!n && 'undefined' != typeof global && global.crypto) {
            n = global.crypto;
        }
        if (!n && 'function' == typeof require) {
            try {
                n = require('crypto');
            } catch (e) {
            }
        }
        var o = function () {
            if (n) {
                if ('function' == typeof n.getRandomValues) {
                    try {
                        return n.getRandomValues(new Uint32Array(1))[0];
                    } catch (e) {
                    }
                }
                if ('function' == typeof n.randomBytes) {
                    try {
                        return n.randomBytes(4).readInt32LE();
                    } catch (e) {
                    }
                }
            }
            throw new Error('Native crypto module could not be used to get secure random number.');
        };
        var r = Object.create || function () {
            function e() {
            }
            return function (t) {
                var n;
                e.prototype = t;
                n = new e();
                e.prototype = null;
                return n;
            };
        }();
        var i = {
            s: 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
            sigBytes: s.sigBytes = r,
            sigBytes: 4 * d,
            Word: o.extend({
                init: function (e, t) {
                    this.high = e;
                    this.low = t;
                }
            }),
            WordArray: o.extend({
                init: function (e, t) {
                    e = this.words = e || [];
                    this.sigBytes = undefined != t ? t : 8 * e.length;
                },
                toX32: function () {
                    var e = this.words;
                    var t = e.length;
                    var n = [];
                    for (var o = 0; o < t; o++) {
                        var i = e[o];
                        n.push(i.high);
                        n.push(i.low);
                    }
                    return r.create(n, this.sigBytes);
                },
                clone: function () {
                    var e = o.clone.call(this);
                    var t = e.words = this.words.slice(0);
                    var n = t.length;
                    for (var r = 0; r < n; r++) {
                        t[r] = t[r].clone();
                    }
                    return e;
                }
            }),
            high: m + E + (v >>> 0 < T >>> 0 ? 1 : 0),
            sigBytes: 4 * t,
            n: v << 24 | v >>> 8,
            s: t[s],
            s: i[s - n] ^ l
        };
        var s = i.lib = {};
        var a = s.Base = {
            extend: function (e) {
                var t = r(this);
                if (e) {
                    t.mixIn(e);
                }
                if (!(t.hasOwnProperty('init') && this.init !== t.init)) {
                    t.init = function () {
                        t.$super.init.apply(this, arguments);
                    };
                }
                t.init.prototype = t;
                t.$super = this;
                return t;
            },
            create: function () {
                var e = this.extend();
                e.init.apply(e, arguments);
                return e;
            },
            init: function () {
            },
            mixIn: function (e) {
                for (var t in e)
                    if (e.hasOwnProperty(t)) {
                        this[t] = e[t];
                    }
                if (e.hasOwnProperty('toString')) {
                    this.toString = e.toString;
                }
            },
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
        var c = s.WordArray = a.extend({
            init: function (e, t) {
                e = this.words = e || [];
                this.sigBytes = undefined != t ? t : 4 * e.length;
            },
            toString: function (e) {
                return (e || d).stringify(this);
            },
            concat: function (e) {
                var t = this.words;
                var n = e.words;
                var o = this.sigBytes;
                var r = e.sigBytes;
                this.clamp();
                if (o % 4) {
                    for (var i = 0; i < r; i++) {
                        var s = n[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                        t[o + i >>> 2] |= s << 24 - (o + i) % 4 * 8;
                    }
                } else {
                    for (i = 0; i < r; i += 4) {
                        t[o + i >>> 2] = n[i >>> 2];
                    }
                }
                this.sigBytes += r;
                return this;
            },
            clamp: function () {
                var t = this.words;
                var n = this.sigBytes;
                t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8;
                t.length = e.ceil(n / 4);
            },
            clone: function () {
                var e = a.clone.call(this);
                e.words = this.words.slice(0);
                return e;
            },
            random: function (e) {
                var t = [];
                for (var n = 0; n < e; n += 4) {
                    t.push(o());
                }
                return new c.init(t, e);
            }
        });
        var l = i.enc = {};
        var d = l.Hex = {
            stringify: function (e) {
                var t = e.words;
                var n = e.sigBytes;
                var o = [];
                for (var r = 0; r < n; r++) {
                    var i = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                    o.push((i >>> 4).toString(16));
                    o.push((15 & i).toString(16));
                }
                return o.join('');
            },
            parse: function (e) {
                var t = e.length;
                var n = [];
                for (var o = 0; o < t; o += 2) {
                    n[o >>> 3] |= parseInt(e.substr(o, 2), 16) << 24 - o % 8 * 4;
                }
                return new c.init(n, t / 2);
            }
        };
        var u = l.Latin1 = {
            stringify: function (e) {
                var t = e.words;
                var n = e.sigBytes;
                var o = [];
                for (var r = 0; r < n; r++) {
                    var i = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                    o.push(String.fromCharCode(i));
                }
                return o.join('');
            },
            parse: function (e) {
                var t = e.length;
                var n = [];
                for (var o = 0; o < t; o++) {
                    n[o >>> 2] |= (255 & e.charCodeAt(o)) << 24 - o % 4 * 8;
                }
                return new c.init(n, t);
            }
        };
        var f = l.Utf8 = {
            stringify: function (e) {
                try {
                    return decodeURIComponent(escape(u.stringify(e)));
                } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                }
            },
            parse: function (e) {
                return u.parse(unescape(encodeURIComponent(e)));
            }
        };
        var h = s.BufferedBlockAlgorithm = a.extend({
            reset: function () {
                this._data = new c.init();
                this._nDataBytes = 0;
            },
            _append: function (e) {
                if ('string' == typeof e) {
                    e = f.parse(e);
                }
                this._data.concat(e);
                this._nDataBytes += e.sigBytes;
            },
            _process: function (t) {
                var n;
                var o = this._data;
                var r = o.words;
                var i = o.sigBytes;
                var s = this.blockSize;
                var a = i / (4 * s);
                var l = (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) * s;
                var d = e.min(4 * l, i);
                if (l) {
                    for (var u = 0; u < l; u += s) {
                        this._doProcessBlock(r, u);
                    }
                    n = r.splice(0, l);
                    o.sigBytes -= d;
                }
                return new c.init(n, d);
            },
            clone: function () {
                var e = a.clone.call(this);
                e._data = this._data.clone();
                return e;
            },
            _minBufferSize: 0
        });
        s.Hasher = h.extend({
            cfg: a.extend(),
            init: function (e) {
                this.cfg = this.cfg.extend(e);
                this.reset();
            },
            reset: function () {
                h.reset.call(this);
                this._doReset();
            },
            update: function (e) {
                this._append(e);
                this._process();
                return this;
            },
            finalize: function (e) {
                if (e) {
                    this._append(e);
                }
                return this._doFinalize();
            },
            blockSize: 16,
            _createHelper: function (e) {
                return function (t, n) {
                    return new e.init(n).finalize(t);
                };
            },
            _createHmacHelper: function (e) {
                return function (t, n) {
                    return new w.HMAC.init(e, n).finalize(t);
                };
            }
        });
        var w = i.algo = {};
        return i;
    }(Math);
    (function () {
        var t = l.lib.WordArray;
        l.enc.Base64 = {
            stringify: function (e) {
                var t = e.words;
                var n = e.sigBytes;
                var o = this._map;
                e.clamp();
                var r = [];
                for (var i = 0; i < n; i += 3) {
                    var s = (t[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 16 | (t[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255) << 8 | t[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
                    for (var a = 0; a < 4 && i + 0.75 * a < n; a++) {
                        r.push(o.charAt(s >>> 6 * (3 - a) & 63));
                    }
                }
                var c = o.charAt(64);
                if (c) {
                    for (; r.length % 4;) {
                        r.push(c);
                    }
                }
                return r.join('');
            },
            parse: function (e) {
                var n = e.length;
                var o = this._map;
                var r = this._reverseMap;
                if (!r) {
                    r = this._reverseMap = [];
                    for (var i = 0; i < o.length; i++) {
                        r[o.charCodeAt(i)] = i;
                    }
                }
                var s = o.charAt(64);
                if (s) {
                    var a = e.indexOf(s);
                    if (-1 !== a) {
                        n = a;
                    }
                }
                return function (e, n, o) {
                    var r = [];
                    var i = 0;
                    for (var s = 0; s < n; s++) {
                        if (s % 4) {
                            var a = o[e.charCodeAt(s - 1)] << s % 4 * 2;
                            var c = o[e.charCodeAt(s)] >>> 6 - s % 4 * 2;
                            var l = a | c;
                            r[i >>> 2] |= l << 24 - i % 4 * 8;
                            i++;
                        }
                    }
                    return t.create(r, i);
                }(e, n, r);
            },
            _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        };
    }());
    (function (e) {
        var n = l.lib;
        var o = n.WordArray;
        var r = n.Hasher;
        var i = l.algo;
        var s = [];
        !function () {
            for (var t = 0; t < 64; t++) {
                s[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;
            }
        }();
        var a = i.MD5 = r.extend({
            _doReset: function () {
                this._hash = new o.init([
                    1732584193,
                    4023233417,
                    2562383102,
                    271733878
                ]);
            },
            _doProcessBlock: function (e, t) {
                for (var n = 0; n < 16; n++) {
                    var o = t + n;
                    var r = e[o];
                    e[o] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8);
                }
                var i = this._hash.words;
                var a = e[t + 0];
                var l = e[t + 1];
                var h = e[t + 2];
                var w = e[t + 3];
                var g = e[t + 4];
                var p = e[t + 5];
                var m = e[t + 6];
                var v = e[t + 7];
                var y = e[t + 8];
                var b = e[t + 9];
                var O = e[t + 10];
                var _ = e[t + 11];
                var k = e[t + 12];
                var x = e[t + 13];
                var S = e[t + 14];
                var C = e[t + 15];
                var B = i[0];
                var L = i[1];
                var N = i[2];
                var U = i[3];
                L = f(L = f(L = f(L = f(L = u(L = u(L = u(L = u(L = d(L = d(L = d(L = d(L = c(L = c(L = c(L = c(L, N = c(N, U = c(U, B = c(B, L, N, U, a, 7, s[0]), L, N, l, 12, s[1]), B, L, h, 17, s[2]), U, B, w, 22, s[3]), N = c(N, U = c(U, B = c(B, L, N, U, g, 7, s[4]), L, N, p, 12, s[5]), B, L, m, 17, s[6]), U, B, v, 22, s[7]), N = c(N, U = c(U, B = c(B, L, N, U, y, 7, s[8]), L, N, b, 12, s[9]), B, L, O, 17, s[10]), U, B, _, 22, s[11]), N = c(N, U = c(U, B = c(B, L, N, U, k, 7, s[12]), L, N, x, 12, s[13]), B, L, S, 17, s[14]), U, B, C, 22, s[15]), N = d(N, U = d(U, B = d(B, L, N, U, l, 5, s[16]), L, N, m, 9, s[17]), B, L, _, 14, s[18]), U, B, a, 20, s[19]), N = d(N, U = d(U, B = d(B, L, N, U, p, 5, s[20]), L, N, O, 9, s[21]), B, L, C, 14, s[22]), U, B, g, 20, s[23]), N = d(N, U = d(U, B = d(B, L, N, U, b, 5, s[24]), L, N, S, 9, s[25]), B, L, w, 14, s[26]), U, B, y, 20, s[27]), N = d(N, U = d(U, B = d(B, L, N, U, x, 5, s[28]), L, N, h, 9, s[29]), B, L, v, 14, s[30]), U, B, k, 20, s[31]), N = u(N, U = u(U, B = u(B, L, N, U, p, 4, s[32]), L, N, y, 11, s[33]), B, L, _, 16, s[34]), U, B, S, 23, s[35]), N = u(N, U = u(U, B = u(B, L, N, U, l, 4, s[36]), L, N, g, 11, s[37]), B, L, v, 16, s[38]), U, B, O, 23, s[39]), N = u(N, U = u(U, B = u(B, L, N, U, x, 4, s[40]), L, N, a, 11, s[41]), B, L, w, 16, s[42]), U, B, m, 23, s[43]), N = u(N, U = u(U, B = u(B, L, N, U, b, 4, s[44]), L, N, k, 11, s[45]), B, L, C, 16, s[46]), U, B, h, 23, s[47]), N = f(N, U = f(U, B = f(B, L, N, U, a, 6, s[48]), L, N, v, 10, s[49]), B, L, S, 15, s[50]), U, B, p, 21, s[51]), N = f(N, U = f(U, B = f(B, L, N, U, k, 6, s[52]), L, N, w, 10, s[53]), B, L, O, 15, s[54]), U, B, l, 21, s[55]), N = f(N, U = f(U, B = f(B, L, N, U, y, 6, s[56]), L, N, C, 10, s[57]), B, L, m, 15, s[58]), U, B, x, 21, s[59]), N = f(N, U = f(U, B = f(B, L, N, U, g, 6, s[60]), L, N, _, 10, s[61]), B, L, h, 15, s[62]), U, B, b, 21, s[63]);
                i[0] = i[0] + B | 0;
                i[1] = i[1] + L | 0;
                i[2] = i[2] + N | 0;
                i[3] = i[3] + U | 0;
            },
            _doFinalize: function () {
                var t = this._data;
                var n = t.words;
                var o = 8 * this._nDataBytes;
                var r = 8 * t.sigBytes;
                n[r >>> 5] |= 128 << 24 - r % 32;
                var i = e.floor(o / 4294967296);
                n[15 + (r + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
                n[14 + (r + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
                t.sigBytes = 4 * (n.length + 1);
                this._process();
                var a = this._hash;
                var c = a.words;
                for (var l = 0; l < 4; l++) {
                    var d = c[l];
                    c[l] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8);
                }
                return a;
            },
            clone: function () {
                var e = r.clone.call(this);
                e._hash = this._hash.clone();
                return e;
            }
        });
        function c(e, t, n, o, r, i, s) {
            var a = e + (t & n | ~t & o) + r + s;
            return (a << i | a >>> 32 - i) + t;
        }
        function d(e, t, n, o, r, i, s) {
            var a = e + (t & o | n & ~o) + r + s;
            return (a << i | a >>> 32 - i) + t;
        }
        function u(e, t, n, o, r, i, s) {
            var a = e + (t ^ n ^ o) + r + s;
            return (a << i | a >>> 32 - i) + t;
        }
        function f(e, t, n, o, r, i, s) {
            var a = e + (n ^ (t | ~o)) + r + s;
            return (a << i | a >>> 32 - i) + t;
        }
        l.MD5 = r._createHelper(a);
        l.HmacMD5 = r._createHmacHelper(a);
    }(Math));
    t = l.lib;
    n = t.WordArray;
    o = t.Hasher;
    r = [];
    i = l.algo.SHA1 = o.extend({
        _doReset: function () {
            this._hash = new n.init([
                1732584193,
                4023233417,
                2562383102,
                271733878,
                3285377520
            ]);
        },
        _doProcessBlock: function (e, t) {
            var n = this._hash.words;
            var o = n[0];
            var i = n[1];
            var s = n[2];
            var a = n[3];
            var c = n[4];
            for (var l = 0; l < 80; l++) {
                if (l < 16) {
                    r[l] = 0 | e[t + l];
                } else {
                    var d = r[l - 3] ^ r[l - 8] ^ r[l - 14] ^ r[l - 16];
                    r[l] = d << 1 | d >>> 31;
                }
                var u = (o << 5 | o >>> 27) + c + r[l];
                u += l < 20 ? 1518500249 + (i & s | ~i & a) : l < 40 ? 1859775393 + (i ^ s ^ a) : l < 60 ? (i & s | i & a | s & a) - 1894007588 : (i ^ s ^ a) - 899497514;
                c = a;
                a = s;
                s = i << 30 | i >>> 2;
                i = o;
                o = u;
            }
            n[0] = n[0] + o | 0;
            n[1] = n[1] + i | 0;
            n[2] = n[2] + s | 0;
            n[3] = n[3] + a | 0;
            n[4] = n[4] + c | 0;
        },
        _doFinalize: function () {
            var e = this._data;
            var t = e.words;
            var n = 8 * this._nDataBytes;
            var o = 8 * e.sigBytes;
            t[o >>> 5] |= 128 << 24 - o % 32;
            t[14 + (o + 64 >>> 9 << 4)] = Math.floor(n / 4294967296);
            t[15 + (o + 64 >>> 9 << 4)] = n;
            e.sigBytes = 4 * t.length;
            this._process();
            return this._hash;
        },
        clone: function () {
            var e = o.clone.call(this);
            e._hash = this._hash.clone();
            return e;
        }
    });
    l.SHA1 = o._createHelper(i);
    l.HmacSHA1 = o._createHmacHelper(i);
    (function (e) {
        var n = l.lib;
        var o = n.WordArray;
        var r = n.Hasher;
        var i = l.algo;
        var s = [];
        var a = [];
        !function () {
            function t(t) {
                var n = e.sqrt(t);
                for (var o = 2; o <= n; o++) {
                    if (!(t % o)) {
                        return false;
                    }
                }
                return true;
            }
            var o = 2;
            for (var r = 0; r < 64;) {
                if (t(o)) {
                    if (r < 8) {
                        s[r] = 4294967296 * (e.pow(o, 0.5) - (0 | e.pow(o, 0.5))) | 0;
                    }
                    a[r] = 4294967296 * (e.pow(o, 0.3333333333333333) - (0 | e.pow(o, 0.3333333333333333))) | 0;
                    r++;
                }
                o++;
            }
        }();
        var c = [];
        var d = i.SHA256 = r.extend({
            _doReset: function () {
                this._hash = new o.init(s.slice(0));
            },
            _doProcessBlock: function (e, t) {
                var n = this._hash.words;
                var o = n[0];
                var r = n[1];
                var i = n[2];
                var s = n[3];
                var l = n[4];
                var d = n[5];
                var u = n[6];
                var f = n[7];
                for (var h = 0; h < 64; h++) {
                    if (h < 16) {
                        c[h] = 0 | e[t + h];
                    } else {
                        var w = c[h - 15];
                        var g = (w << 25 | w >>> 7) ^ (w << 14 | w >>> 18) ^ w >>> 3;
                        var p = c[h - 2];
                        var m = (p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10;
                        c[h] = g + c[h - 7] + m + c[h - 16];
                    }
                    var v = o & r ^ o & i ^ r & i;
                    var y = (o << 30 | o >>> 2) ^ (o << 19 | o >>> 13) ^ (o << 10 | o >>> 22);
                    var b = f + ((l << 26 | l >>> 6) ^ (l << 21 | l >>> 11) ^ (l << 7 | l >>> 25)) + (l & d ^ ~l & u) + a[h] + c[h];
                    f = u;
                    u = d;
                    d = l;
                    l = s + b | 0;
                    s = i;
                    i = r;
                    r = o;
                    o = b + (y + v) | 0;
                }
                n[0] = n[0] + o | 0;
                n[1] = n[1] + r | 0;
                n[2] = n[2] + i | 0;
                n[3] = n[3] + s | 0;
                n[4] = n[4] + l | 0;
                n[5] = n[5] + d | 0;
                n[6] = n[6] + u | 0;
                n[7] = n[7] + f | 0;
            },
            _doFinalize: function () {
                var t = this._data;
                var n = t.words;
                var o = 8 * this._nDataBytes;
                var r = 8 * t.sigBytes;
                n[r >>> 5] |= 128 << 24 - r % 32;
                n[14 + (r + 64 >>> 9 << 4)] = e.floor(o / 4294967296);
                n[15 + (r + 64 >>> 9 << 4)] = o;
                t.sigBytes = 4 * n.length;
                this._process();
                return this._hash;
            },
            clone: function () {
                var e = r.clone.call(this);
                e._hash = this._hash.clone();
                return e;
            }
        });
        l.SHA256 = r._createHelper(d);
        l.HmacSHA256 = r._createHmacHelper(d);
    }(Math));
    (function () {
        var t = l.lib.WordArray;
        var n = l.enc;
        n.Utf16 = n.Utf16BE = {
            stringify: function (e) {
                var t = e.words;
                var n = e.sigBytes;
                var o = [];
                for (var r = 0; r < n; r += 2) {
                    var i = t[r >>> 2] >>> 16 - r % 4 * 8 & 65535;
                    o.push(String.fromCharCode(i));
                }
                return o.join('');
            },
            parse: function (e) {
                var n = e.length;
                var o = [];
                for (var r = 0; r < n; r++) {
                    o[r >>> 1] |= e.charCodeAt(r) << 16 - r % 2 * 16;
                }
                return t.create(o, 2 * n);
            }
        };
        n.Utf16LE = {
            stringify: function (e) {
                var t = e.words;
                var n = e.sigBytes;
                var r = [];
                for (var i = 0; i < n; i += 2) {
                    var s = (t[i >>> 2] >>> 16 - i % 4 * 8 & 65535) << 8 & 4278255360 | (t[i >>> 2] >>> 16 - i % 4 * 8 & 65535) >>> 8 & 16711935;
                    r.push(String.fromCharCode(s));
                }
                return r.join('');
            },
            parse: function (e) {
                var n = e.length;
                var r = [];
                for (var i = 0; i < n; i++) {
                    r[i >>> 1] |= e.charCodeAt(i) << 16 - i % 2 * 16 << 8 & 4278255360 | e.charCodeAt(i) << 16 - i % 2 * 16 >>> 8 & 16711935;
                }
                return t.create(r, 2 * n);
            }
        };
    }());
    (function () {
        if ('function' == typeof ArrayBuffer) {
            var e = l.lib.WordArray;
            var t = e.init;
            (e.init = function (e) {
                if (e instanceof ArrayBuffer) {
                    e = new Uint8Array(e);
                }
                if (e instanceof Int8Array || 'undefined' != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) {
                    e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
                }
                if (e instanceof Uint8Array) {
                    var n = e.byteLength;
                    var o = [];
                    for (var r = 0; r < n; r++) {
                        o[r >>> 2] |= e[r] << 24 - r % 4 * 8;
                    }
                    t.call(this, o, n);
                } else {
                    t.apply(this, arguments);
                }
            }).prototype = e;
        }
    }());
    (function (e) {
        var n = l.lib;
        var o = n.WordArray;
        var r = n.Hasher;
        var i = l.algo;
        var s = o.create([
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            7,
            4,
            13,
            1,
            10,
            6,
            15,
            3,
            12,
            0,
            9,
            5,
            2,
            14,
            11,
            8,
            3,
            10,
            14,
            4,
            9,
            15,
            8,
            1,
            2,
            7,
            0,
            6,
            13,
            11,
            5,
            12,
            1,
            9,
            11,
            10,
            0,
            8,
            12,
            4,
            13,
            3,
            7,
            15,
            14,
            5,
            6,
            2,
            4,
            0,
            5,
            9,
            7,
            12,
            2,
            10,
            14,
            1,
            3,
            8,
            11,
            6,
            15,
            13
        ]);
        var a = o.create([
            5,
            14,
            7,
            0,
            9,
            2,
            11,
            4,
            13,
            6,
            15,
            8,
            1,
            10,
            3,
            12,
            6,
            11,
            3,
            7,
            0,
            13,
            5,
            10,
            14,
            15,
            8,
            12,
            4,
            9,
            1,
            2,
            15,
            5,
            1,
            3,
            7,
            14,
            6,
            9,
            11,
            8,
            12,
            2,
            10,
            0,
            4,
            13,
            8,
            6,
            4,
            1,
            3,
            11,
            15,
            0,
            5,
            12,
            2,
            13,
            9,
            7,
            10,
            14,
            12,
            15,
            10,
            4,
            1,
            5,
            8,
            7,
            6,
            2,
            13,
            14,
            0,
            3,
            9,
            11
        ]);
        var c = o.create([
            11,
            14,
            15,
            12,
            5,
            8,
            7,
            9,
            11,
            13,
            14,
            15,
            6,
            7,
            9,
            8,
            7,
            6,
            8,
            13,
            11,
            9,
            7,
            15,
            7,
            12,
            15,
            9,
            11,
            7,
            13,
            12,
            11,
            13,
            6,
            7,
            14,
            9,
            13,
            15,
            14,
            8,
            13,
            6,
            5,
            12,
            7,
            5,
            11,
            12,
            14,
            15,
            14,
            15,
            9,
            8,
            9,
            14,
            5,
            6,
            8,
            6,
            5,
            12,
            9,
            15,
            5,
            11,
            6,
            8,
            13,
            12,
            5,
            12,
            13,
            14,
            11,
            8,
            5,
            6
        ]);
        var d = o.create([
            8,
            9,
            9,
            11,
            13,
            15,
            15,
            5,
            7,
            7,
            8,
            11,
            14,
            14,
            12,
            6,
            9,
            13,
            15,
            7,
            12,
            8,
            9,
            11,
            7,
            7,
            12,
            7,
            6,
            15,
            13,
            11,
            9,
            7,
            15,
            11,
            8,
            6,
            6,
            14,
            12,
            13,
            5,
            14,
            13,
            13,
            7,
            5,
            15,
            5,
            8,
            11,
            14,
            14,
            6,
            14,
            6,
            9,
            12,
            9,
            12,
            5,
            15,
            8,
            8,
            5,
            12,
            9,
            12,
            5,
            14,
            6,
            8,
            13,
            6,
            5,
            15,
            13,
            11,
            11
        ]);
        var u = o.create([
            0,
            1518500249,
            1859775393,
            2400959708,
            2840853838
        ]);
        var f = o.create([
            1352829926,
            1548603684,
            1836072691,
            2053994217,
            0
        ]);
        var h = i.RIPEMD160 = r.extend({
            _doReset: function () {
                this._hash = o.create([
                    1732584193,
                    4023233417,
                    2562383102,
                    271733878,
                    3285377520
                ]);
            },
            _doProcessBlock: function (e, t) {
                for (var n = 0; n < 16; n++) {
                    var o = t + n;
                    var r = e[o];
                    e[o] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8);
                }
                var i;
                var l;
                var h;
                var b;
                var O;
                var _;
                var k;
                var x;
                var S;
                var C;
                var B;
                var L = this._hash.words;
                var N = u.words;
                var U = f.words;
                var R = s.words;
                var A = a.words;
                var E = c.words;
                var T = d.words;
                _ = i = L[0];
                k = l = L[1];
                x = h = L[2];
                S = b = L[3];
                C = O = L[4];
                for (n = 0; n < 80; n += 1) {
                    B = i + e[t + R[n]] | 0;
                    B += n < 16 ? (l ^ h ^ b) + N[0] : n < 32 ? (l & h | ~l & b) + N[1] : n < 48 ? ((l | ~h) ^ b) + N[2] : n < 64 ? (l & b | h & ~b) + N[3] : (l ^ (h | ~b)) + N[4];
                    B = (B = (B |= 0) << E[n] | (B |= 0) >>> 32 - E[n]) + O | 0;
                    i = O;
                    O = b;
                    b = h << 10 | h >>> 22;
                    h = l;
                    l = B;
                    B = _ + e[t + A[n]] | 0;
                    B += n < 16 ? (k ^ (x | ~S)) + U[0] : n < 32 ? (k & S | x & ~S) + U[1] : n < 48 ? ((k | ~x) ^ S) + U[2] : n < 64 ? (k & x | ~k & S) + U[3] : (k ^ x ^ S) + U[4];
                    B = (B = (B |= 0) << T[n] | (B |= 0) >>> 32 - T[n]) + C | 0;
                    _ = C;
                    C = S;
                    S = x << 10 | x >>> 22;
                    x = k;
                    k = B;
                }
                B = L[1] + h + S | 0;
                L[1] = L[2] + b + C | 0;
                L[2] = L[3] + O + _ | 0;
                L[3] = L[4] + i + k | 0;
                L[4] = L[0] + l + x | 0;
                L[0] = B;
            },
            _doFinalize: function () {
                var e = this._data;
                var t = e.words;
                var n = 8 * this._nDataBytes;
                var o = 8 * e.sigBytes;
                t[o >>> 5] |= 128 << 24 - o % 32;
                t[14 + (o + 64 >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
                e.sigBytes = 4 * (t.length + 1);
                this._process();
                var r = this._hash;
                var i = r.words;
                for (var s = 0; s < 5; s++) {
                    var a = i[s];
                    ;
                }
                return r;
            },
            clone: function () {
                var e = r.clone.call(this);
                e._hash = this._hash.clone();
                return e;
            }
        });
        l.RIPEMD160 = r._createHelper(h);
        l.HmacRIPEMD160 = r._createHmacHelper(h);
    }(Math));
    (function () {
        var t = l.lib.Base;
        var n = l.enc.Utf8;
        l.algo.HMAC = t.extend({
            init: function (e, t) {
                e = this._hasher = new e.init();
                if ('string' == typeof t) {
                    t = n.parse(t);
                }
                var o = e.blockSize;
                var r = 4 * o;
                if (t.sigBytes > r) {
                    t = e.finalize(t);
                }
                t.clamp();
                var i = this._oKey = t.clone();
                var s = this._iKey = t.clone();
                var a = i.words;
                var c = s.words;
                for (var l = 0; l < o; l++) {
                    a[l] ^= 1549556828;
                    c[l] ^= 909522486;
                }
                ;
                this.reset();
            },
            reset: function () {
                var e = this._hasher;
                e.reset();
                e.update(this._iKey);
            },
            update: function (e) {
                this._hasher.update(e);
                return this;
            },
            finalize: function (e) {
                var t = this._hasher;
                var n = t.finalize(e);
                t.reset();
                return t.finalize(this._oKey.clone().concat(n));
            }
        });
    }());
    (function () {
        var t = l.lib;
        var n = t.Base;
        var o = t.WordArray;
        var r = l.algo;
        var i = r.SHA1;
        var s = r.HMAC;
        var a = r.PBKDF2 = n.extend({
            cfg: n.extend({
                keySize: 4,
                hasher: i,
                iterations: 1
            }),
            init: function (e) {
                this.cfg = this.cfg.extend(e);
            },
            compute: function (e, t) {
                var n = this.cfg;
                var r = s.create(n.hasher, e);
                var i = o.create();
                var a = o.create([1]);
                var c = i.words;
                var l = a.words;
                var d = n.keySize;
                for (var u = n.iterations; c.length < d;) {
                    var f = r.update(t).finalize(a);
                    r.reset();
                    var h = f.words;
                    var w = h.length;
                    var g = f;
                    for (var p = 1; p < u; p++) {
                        g = r.finalize(g);
                        r.reset();
                        var m = g.words;
                        for (var v = 0; v < w; v++) {
                            h[v] ^= m[v];
                        }
                    }
                    i.concat(f);
                    l[0]++;
                }
                ;
                return i;
            }
        });
        l.PBKDF2 = function (e, t, n) {
            return a.create(n).compute(e, t);
        };
    }());
    (function () {
        var t = l.lib;
        var n = t.Base;
        var o = t.WordArray;
        var r = l.algo;
        var i = r.MD5;
        var s = r.EvpKDF = n.extend({
            cfg: n.extend({
                keySize: 4,
                hasher: i,
                iterations: 1
            }),
            init: function (e) {
                this.cfg = this.cfg.extend(e);
            },
            compute: function (e, t) {
                var n;
                var r = this.cfg;
                var i = r.hasher.create();
                var s = o.create();
                var a = s.words;
                var c = r.keySize;
                for (var l = r.iterations; a.length < c;) {
                    if (n) {
                        i.update(n);
                    }
                    n = i.update(e).finalize(t);
                    i.reset();
                    for (var d = 1; d < l; d++) {
                        n = i.finalize(n);
                        i.reset();
                    }
                    s.concat(n);
                }
                s.sigBytes = 4 * c;
                return s;
            }
        });
        l.EvpKDF = function (e, t, n) {
            return s.create(n).compute(e, t);
        };
    }());
    (function () {
        var t = l.lib.WordArray;
        var n = l.algo;
        var o = n.SHA256;
        var r = n.SHA224 = o.extend({
            _doReset: function () {
                this._hash = new t.init([
                    3238371032,
                    914150663,
                    812702999,
                    4144912697,
                    4290775857,
                    1750603025,
                    1694076839,
                    3204075428
                ]);
            },
            _doFinalize: function () {
                var e = o._doFinalize.call(this);
                e.sigBytes -= 4;
                return e;
            }
        });
        l.SHA224 = o._createHelper(r);
        l.HmacSHA224 = o._createHmacHelper(r);
    }());
    (function (e) {
        var n = l.lib;
        var o = n.Base;
        var r = n.WordArray;
        var i = l.x64 = {};
        ;
        ;
    }());
    (function (e) {
        var n = l.lib;
        var o = n.WordArray;
        var r = n.Hasher;
        var i = l.x64.Word;
        var s = l.algo;
        var a = [];
        var c = [];
        var d = [];
        !function () {
            var e = 1;
            var t = 0;
            for (var n = 0; n < 24; n++) {
                a[e + 5 * t] = (n + 1) * (n + 2) / 2 % 64;
                var o = (2 * e + 3 * t) % 5;
                e = t % 5;
                t = o;
            }
            for (e = 0; e < 5; e++) {
                for (t = 0; t < 5; t++) {
                    c[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
                }
            }
            var r = 1;
            for (var s = 0; s < 24; s++) {
                var l = 0;
                var u = 0;
                for (var f = 0; f < 7; f++) {
                    if (1 & r) {
                        var h = (1 << f) - 1;
                        if (h < 32) {
                            u ^= 1 << h;
                        } else {
                            l ^= 1 << h - 32;
                        }
                    }
                    if (128 & r) {
                        r = r << 1 ^ 113;
                    } else {
                        r <<= 1;
                    }
                }
                d[s] = i.create(l, u);
            }
        }();
        var u = [];
        !function () {
            for (var e = 0; e < 25; e++) {
                u[e] = i.create();
            }
        }();
        var f = s.SHA3 = r.extend({
            cfg: r.cfg.extend({ outputLength: 512 }),
            _doReset: function () {
                var e = this._state = [];
                for (var t = 0; t < 25; t++) {
                    e[t] = new i.init();
                }
                this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function (e, t) {
                var n = this._state;
                var o = this.blockSize / 2;
                for (var r = 0; r < o; r++) {
                    var i = e[t + 2 * r];
                    var s = e[t + 2 * r + 1];
                    i = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
                    s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
                    (L = n[r]).high ^= s;
                    L.low ^= i;
                }
                for (var l = 0; l < 24; l++) {
                    for (var f = 0; f < 5; f++) {
                        var h = 0;
                        var w = 0;
                        for (var g = 0; g < 5; g++) {
                            h ^= (L = n[f + 5 * g]).high;
                            w ^= L.low;
                        }
                        var p = u[f];
                        p.high = h;
                        p.low = w;
                    }
                    for (f = 0; f < 5; f++) {
                        var m = u[(f + 4) % 5];
                        var v = u[(f + 1) % 5];
                        var y = v.high;
                        var b = v.low;
                        h = m.high ^ (y << 1 | b >>> 31);
                        w = m.low ^ (b << 1 | y >>> 31);
                        for (g = 0; g < 5; g++) {
                            (L = n[f + 5 * g]).high ^= h;
                            L.low ^= w;
                        }
                    }
                    for (var O = 1; O < 25; O++) {
                        var _ = (L = n[O]).high;
                        var k = L.low;
                        var x = a[O];
                        if (x < 32) {
                            h = _ << x | k >>> 32 - x;
                            w = k << x | _ >>> 32 - x;
                        } else {
                            h = k << x - 32 | _ >>> 64 - x;
                            w = _ << x - 32 | k >>> 64 - x;
                        }
                        var S = u[c[O]];
                        S.high = h;
                        S.low = w;
                    }
                    var C = u[0];
                    var B = n[0];
                    C.high = B.high;
                    C.low = B.low;
                    for (f = 0; f < 5; f++) {
                        for (g = 0; g < 5; g++) {
                            var L = n[O = f + 5 * g];
                            var N = u[O];
                            var U = u[(f + 1) % 5 + 5 * g];
                            var R = u[(f + 2) % 5 + 5 * g];
                            L.high = N.high ^ ~U.high & R.high;
                            L.low = N.low ^ ~U.low & R.low;
                        }
                    }
                    L = n[0];
                    var A = d[l];
                    L.high ^= A.high;
                    L.low ^= A.low;
                }
            },
            _doFinalize: function () {
                var t = this._data;
                var n = t.words;
                this._nDataBytes;
                var r = 8 * t.sigBytes;
                var i = 32 * this.blockSize;
                n[r >>> 5] |= 1 << 24 - r % 32;
                n[(e.ceil((r + 1) / i) * i >>> 5) - 1] |= 128;
                t.sigBytes = 4 * n.length;
                this._process();
                var s = this._state;
                var a = this.cfg.outputLength / 8;
                var c = a / 8;
                var l = [];
                for (var d = 0; d < c; d++) {
                    var u = s[d];
                    var f = u.high;
                    var h = u.low;
                    f = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8);
                    h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8);
                    l.push(h);
                    l.push(f);
                }
                return new o.init(l, a);
            },
            clone: function () {
                var e = r.clone.call(this);
                var t = e._state = this._state.slice(0);
                for (var n = 0; n < 25; n++) {
                    t[n] = t[n].clone();
                }
                return e;
            }
        });
        l.SHA3 = r._createHelper(f);
        l.HmacSHA3 = r._createHmacHelper(f);
    }(Math));
    (function () {
        var t = l.lib.Hasher;
        var n = l.x64;
        var o = n.Word;
        var r = n.WordArray;
        var i = l.algo;
        var a = [
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments),
            o.create.apply(o, arguments)
        ];
        var c = [];
        !function () {
            for (var e = 0; e < 80; e++) {
                c[e] = o.create.apply(o, arguments);
            }
        }();
        var d = i.SHA512 = t.extend({
            _doReset: function () {
                this._hash = new r.init([
                    new o.init(1779033703, 4089235720),
                    new o.init(3144134277, 2227873595),
                    new o.init(1013904242, 4271175723),
                    new o.init(2773480762, 1595750129),
                    new o.init(1359893119, 2917565137),
                    new o.init(2600822924, 725511199),
                    new o.init(528734635, 4215389547),
                    new o.init(1541459225, 327033209)
                ]);
            },
            _doProcessBlock: function (e, t) {
                var n = this._hash.words;
                var o = n[0];
                var r = n[1];
                var i = n[2];
                var s = n[3];
                var l = n[4];
                var d = n[5];
                var u = n[6];
                var f = n[7];
                var h = o.high;
                var w = o.low;
                var g = r.high;
                var p = r.low;
                var m = i.high;
                var v = i.low;
                var y = s.high;
                var b = s.low;
                var O = l.high;
                var _ = l.low;
                var k = d.high;
                var x = d.low;
                var S = u.high;
                var C = u.low;
                var B = f.high;
                var L = f.low;
                var N = h;
                var U = w;
                var R = g;
                var A = p;
                var E = m;
                var T = v;
                var I = y;
                var D = b;
                var H = O;
                var F = _;
                var q = k;
                var M = x;
                var P = S;
                var W = C;
                var z = B;
                var j = L;
                for (var V = 0; V < 80; V++) {
                    var K;
                    var G;
                    var J = c[V];
                    if (V < 16) {
                        G = J.high = 0 | e[t + 2 * V];
                        K = J.low = 0 | e[t + 2 * V + 1];
                    } else {
                        var Y = c[V - 15];
                        var Z = Y.high;
                        var X = Y.low;
                        var Q = (Z >>> 1 | X << 31) ^ (Z >>> 8 | X << 24) ^ Z >>> 7;
                        var $ = (X >>> 1 | Z << 31) ^ (X >>> 8 | Z << 24) ^ (X >>> 7 | Z << 25);
                        var ee = c[V - 2];
                        var te = ee.high;
                        var ne = ee.low;
                        var oe = (te >>> 19 | ne << 13) ^ (te << 3 | ne >>> 29) ^ te >>> 6;
                        var re = (ne >>> 19 | te << 13) ^ (ne << 3 | te >>> 29) ^ (ne >>> 6 | te << 26);
                        var ie = c[V - 7];
                        var se = ie.high;
                        var ae = ie.low;
                        var ce = c[V - 16];
                        var le = ce.high;
                        var de = ce.low;
                        G = (G = (G = Q + se + ((K = $ + ae) >>> 0 < $ >>> 0 ? 1 : 0)) + oe + ((K += re) >>> 0 < re >>> 0 ? 1 : 0)) + le + ((K += de) >>> 0 < de >>> 0 ? 1 : 0);
                        J.high = G;
                        J.low = K;
                    }
                    var ue;
                    var fe = H & q ^ ~H & P;
                    var he = F & M ^ ~F & W;
                    var we = N & R ^ N & E ^ R & E;
                    var ge = U & A ^ U & T ^ A & T;
                    var pe = (N >>> 28 | U << 4) ^ (N << 30 | U >>> 2) ^ (N << 25 | U >>> 7);
                    var me = (U >>> 28 | N << 4) ^ (U << 30 | N >>> 2) ^ (U << 25 | N >>> 7);
                    var ve = (H >>> 14 | F << 18) ^ (H >>> 18 | F << 14) ^ (H << 23 | F >>> 9);
                    var ye = (F >>> 14 | H << 18) ^ (F >>> 18 | H << 14) ^ (F << 23 | H >>> 9);
                    var be = a[V];
                    var Oe = be.high;
                    var _e = be.low;
                    var ke = z + ve + ((ue = j + ye) >>> 0 < j >>> 0 ? 1 : 0);
                    var xe = me + ge;
                    z = P;
                    j = W;
                    P = q;
                    W = M;
                    q = H;
                    M = F;
                    H = I + (ke = (ke = (ke = ke + fe + ((ue = ue + he) >>> 0 < he >>> 0 ? 1 : 0)) + Oe + ((ue = ue + _e) >>> 0 < _e >>> 0 ? 1 : 0)) + G + ((ue = ue + K) >>> 0 < K >>> 0 ? 1 : 0)) + ((F = D + ue | 0) >>> 0 < D >>> 0 ? 1 : 0) | 0;
                    I = E;
                    D = T;
                    E = R;
                    T = A;
                    R = N;
                    A = U;
                    N = ke + (pe + we + (xe >>> 0 < me >>> 0 ? 1 : 0)) + ((U = ue + xe | 0) >>> 0 < ue >>> 0 ? 1 : 0) | 0;
                }
                w = o.low = w + U;
                o.high = h + N + (w >>> 0 < U >>> 0 ? 1 : 0);
                p = r.low = p + A;
                r.high = g + R + (p >>> 0 < A >>> 0 ? 1 : 0);
                v = i.low = v + T;
                ;
                b = s.low = b + D;
                s.high = y + I + (b >>> 0 < D >>> 0 ? 1 : 0);
                _ = l.low = _ + F;
                l.high = O + H + (_ >>> 0 < F >>> 0 ? 1 : 0);
                x = d.low = x + M;
                d.high = k + q + (x >>> 0 < M >>> 0 ? 1 : 0);
                C = u.low = C + W;
                u.high = S + P + (C >>> 0 < W >>> 0 ? 1 : 0);
                L = f.low = L + j;
                f.high = B + z + (L >>> 0 < j >>> 0 ? 1 : 0);
            },
            _doFinalize: function () {
                var e = this._data;
                var t = e.words;
                var n = 8 * this._nDataBytes;
                var o = 8 * e.sigBytes;
                t[o >>> 5] |= 128 << 24 - o % 32;
                t[30 + (o + 128 >>> 10 << 5)] = Math.floor(n / 4294967296);
                t[31 + (o + 128 >>> 10 << 5)] = n;
                e.sigBytes = 4 * t.length;
                this._process();
                return this._hash.toX32();
            },
            clone: function () {
                var e = t.clone.call(this);
                e._hash = this._hash.clone();
                return e;
            },
            blockSize: 32
        });
        l.SHA512 = t._createHelper(d);
        l.HmacSHA512 = t._createHmacHelper(d);
    }());
    (function () {
        var t = l.x64;
        var n = t.Word;
        var o = t.WordArray;
        var r = l.algo;
        var i = r.SHA512;
        var s = r.SHA384 = i.extend({
            _doReset: function () {
                this._hash = new o.init([
                    new n.init(3418070365, 3238371032),
                    new n.init(1654270250, 914150663),
                    new n.init(2438529370, 812702999),
                    new n.init(355462360, 4144912697),
                    new n.init(1731405415, 4290775857),
                    new n.init(2394180231, 1750603025),
                    new n.init(3675008525, 1694076839),
                    new n.init(1203062813, 3204075428)
                ]);
            },
            _doFinalize: function () {
                var e = i._doFinalize.call(this);
                e.sigBytes -= 16;
                return e;
            }
        });
        l.SHA384 = i._createHelper(s);
        l.HmacSHA384 = i._createHmacHelper(s);
    }());
    if (!l.lib.Cipher) {
        (function (e) {
            var n = l.lib;
            var o = n.Base;
            var r = n.WordArray;
            var i = n.BufferedBlockAlgorithm;
            var s = l.enc;
            s.Utf8;
            var a = s.Base64;
            var c = l.algo.EvpKDF;
            var d = n.Cipher = i.extend({
                cfg: o.extend(),
                createEncryptor: function (e, t) {
                    return this.create(this._ENC_XFORM_MODE, e, t);
                },
                createDecryptor: function (e, t) {
                    return this.create(this._DEC_XFORM_MODE, e, t);
                },
                init: function (e, t, n) {
                    this.cfg = this.cfg.extend(n);
                    this._xformMode = e;
                    this._key = t;
                    this.reset();
                },
                reset: function () {
                    i.reset.call(this);
                    this._doReset();
                },
                process: function (e) {
                    this._append(e);
                    return this._process();
                },
                finalize: function (e) {
                    if (e) {
                        this._append(e);
                    }
                    return this._doFinalize();
                },
                keySize: 4,
                ivSize: 4,
                _ENC_XFORM_MODE: 1,
                _DEC_XFORM_MODE: 2,
                _createHelper: function () {
                    function e(e) {
                        return 'string' == typeof e ? y : m;
                    }
                    return function (t) {
                        return {
                            encrypt: function (n, o, r) {
                                return e(o).encrypt(t, n, o, r);
                            },
                            decrypt: function (n, o, r) {
                                return e(o).decrypt(t, n, o, r);
                            }
                        };
                    };
                }()
            });
            n.StreamCipher = d.extend({
                _doFinalize: function () {
                    return this._process(true);
                },
                blockSize: 1
            });
            var u = l.mode = {};
            var f = n.BlockCipherMode = o.extend({
                createEncryptor: function (e, t) {
                    return this.Encryptor.create(e, t);
                },
                createDecryptor: function (e, t) {
                    return this.Decryptor.create(e, t);
                },
                init: function (e, t) {
                    this._cipher = e;
                    this._iv = t;
                }
            });
            var h = u.CBC = function () {
                var t = f.extend();
                function n(t, n, o) {
                    var r;
                    var i = this._iv;
                    if (i) {
                        r = i;
                        this._iv = e;
                    } else {
                        r = this._prevBlock;
                    }
                    for (var s = 0; s < o; s++) {
                        t[n + s] ^= r[s];
                    }
                }
                t.Encryptor = t.extend({
                    processBlock: function (e, t) {
                        var o = this._cipher;
                        var r = o.blockSize;
                        n.call(this, e, t, r);
                        o.encryptBlock(e, t);
                        this._prevBlock = e.slice(t, t + r);
                    }
                });
                t.Decryptor = t.extend({
                    processBlock: function (e, t) {
                        var o = this._cipher;
                        var r = o.blockSize;
                        var i = e.slice(t, t + r);
                        o.decryptBlock(e, t);
                        n.call(this, e, t, r);
                        this._prevBlock = i;
                    }
                });
                return t;
            }();
            var w = (l.pad = {}).Pkcs7 = {
                pad: function (e, t) {
                    var n = 4 * t;
                    var o = n - e.sigBytes % n;
                    var i = o << 24 | o << 16 | o << 8 | o;
                    var s = [];
                    for (var a = 0; a < o; a += 4) {
                        s.push(i);
                    }
                    var c = r.create(s, o);
                    e.concat(c);
                },
                unpad: function (e) {
                    var t = 255 & e.words[e.sigBytes - 1 >>> 2];
                    e.sigBytes -= t;
                }
            };
            n.BlockCipher = d.extend({
                cfg: d.cfg.extend({
                    mode: h,
                    padding: w
                }),
                reset: function () {
                    var e;
                    d.reset.call(this);
                    var t = this.cfg;
                    var n = t.iv;
                    var o = t.mode;
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        e = o.createEncryptor;
                    } else {
                        e = o.createDecryptor;
                        this._minBufferSize = 1;
                    }
                    if (this._mode && this._mode.__creator == e) {
                        this._mode.init(this, n && n.words);
                    } else {
                        this._mode = e.call(o, this, n && n.words);
                        this._mode.__creator = e;
                    }
                },
                _doProcessBlock: function (e, t) {
                    this._mode.processBlock(e, t);
                },
                _doFinalize: function () {
                    var e;
                    var t = this.cfg.padding;
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        t.pad(this._data, this.blockSize);
                        e = this._process(true);
                    } else {
                        e = this._process(true);
                        t.unpad(e);
                    }
                    return e;
                },
                blockSize: 4
            });
            var g = n.CipherParams = o.extend({
                init: function (e) {
                    this.mixIn(e);
                },
                toString: function (e) {
                    return (e || this.formatter).stringify(this);
                }
            });
            var p = (l.format = {}).OpenSSL = {
                stringify: function (e) {
                    var t = e.ciphertext;
                    var n = e.salt;
                    return (n ? r.create([
                        1398893684,
                        1701076831
                    ]).concat(n).concat(t) : t).toString(a);
                },
                parse: function (e) {
                    var t;
                    var n = a.parse(e);
                    var o = n.words;
                    if (1398893684 == o[0] && 1701076831 == o[1]) {
                        t = r.create(o.slice(2, 4));
                        o.splice(0, 4);
                        n.sigBytes -= 16;
                    }
                    return g.create({
                        ciphertext: n,
                        salt: t
                    });
                }
            };
            var m = n.SerializableCipher = o.extend({
                cfg: o.extend({ format: p }),
                encrypt: function (e, t, n, o) {
                    o = this.cfg.extend(o);
                    var r = e.createEncryptor(n, o);
                    var i = r.finalize(t);
                    var s = r.cfg;
                    return g.create({
                        ciphertext: i,
                        key: n,
                        iv: s.iv,
                        algorithm: e,
                        mode: s.mode,
                        padding: s.padding,
                        blockSize: e.blockSize,
                        formatter: o.format
                    });
                },
                decrypt: function (e, t, n, o) {
                    o = this.cfg.extend(o);
                    t = this._parse(t, o.format);
                    return e.createDecryptor(n, o).finalize(t.ciphertext);
                },
                _parse: function (e, t) {
                    return 'string' == typeof e ? t.parse(e, this) : e;
                }
            });
            var v = (l.kdf = {}).OpenSSL = {
                execute: function (e, t, n, o) {
                    if (!o) {
                        o = r.random(8);
                    }
                    var i = c.create({ keySize: t + n }).compute(e, o);
                    var s = r.create(i.words.slice(t), 4 * n);
                    ;
                    return g.create({
                        key: i,
                        iv: s,
                        salt: o
                    });
                }
            };
            var y = n.PasswordBasedCipher = m.extend({
                cfg: m.cfg.extend({ kdf: v }),
                encrypt: function (e, t, n, o) {
                    var r = (o = this.cfg.extend(o)).kdf.execute(n, e.keySize, e.ivSize);
                    o.iv = r.iv;
                    var i = m.encrypt.call(this, e, t, r.key, o);
                    i.mixIn(r);
                    return i;
                },
                decrypt: function (e, t, n, o) {
                    o = this.cfg.extend(o);
                    t = this._parse(t, o.format);
                    var r = o.kdf.execute(n, e.keySize, e.ivSize, t.salt);
                    o.iv = r.iv;
                    return m.decrypt.call(this, e, t, r.key, o);
                }
            });
        }());
    }
    l.mode.CFB = function () {
        var e = l.lib.BlockCipherMode.extend();
        function t(e, t, n, o) {
            var r;
            var i = this._iv;
            if (i) {
                r = i.slice(0);
                this._iv = undefined;
            } else {
                r = this._prevBlock;
            }
            o.encryptBlock(r, 0);
            for (var s = 0; s < n; s++) {
                e[t + s] ^= r[s];
            }
        }
        e.Encryptor = e.extend({
            processBlock: function (e, n) {
                var o = this._cipher;
                var r = o.blockSize;
                t.call(this, e, n, r, o);
                this._prevBlock = e.slice(n, n + r);
            }
        });
        e.Decryptor = e.extend({
            processBlock: function (e, n) {
                var o = this._cipher;
                var r = o.blockSize;
                var i = e.slice(n, n + r);
                t.call(this, e, n, r, o);
                this._prevBlock = i;
            }
        });
        return e;
    }();
    (s = l.lib.BlockCipherMode.extend()).Encryptor = s.extend({
        processBlock: function (e, t) {
            this._cipher.encryptBlock(e, t);
        }
    });
    s.Decryptor = s.extend({
        processBlock: function (e, t) {
            this._cipher.decryptBlock(e, t);
        }
    });
    l.mode.ECB = s;
    l.pad.AnsiX923 = {
        pad: function (e, t) {
            var n = e.sigBytes;
            var o = 4 * t;
            var r = o - n % o;
            var i = n + r - 1;
            e.clamp();
            e.words[i >>> 2] |= r << 24 - i % 4 * 8;
            e.sigBytes += r;
        },
        unpad: function (e) {
            var t = 255 & e.words[e.sigBytes - 1 >>> 2];
            e.sigBytes -= t;
        }
    };
    l.pad.Iso10126 = {
        pad: function (e, t) {
            var n = 4 * t;
            var o = n - e.sigBytes % n;
            e.concat(l.lib.WordArray.random(o - 1)).concat(l.lib.WordArray.create([o << 24], 1));
        },
        unpad: function (e) {
            var t = 255 & e.words[e.sigBytes - 1 >>> 2];
            e.sigBytes -= t;
        }
    };
    l.pad.Iso97971 = {
        pad: function (e, t) {
            e.concat(l.lib.WordArray.create([2147483648], 1));
            l.pad.ZeroPadding.pad(e, t);
        },
        unpad: function (e) {
            l.pad.ZeroPadding.unpad(e);
            e.sigBytes--;
        }
    };
    a = l.lib.BlockCipherMode.extend();
    c = a.Encryptor = a.extend({
        processBlock: function (e, t) {
            var n = this._cipher;
            var o = n.blockSize;
            var r = this._iv;
            var i = this._keystream;
            if (r) {
                i = this._keystream = r.slice(0);
                this._iv = undefined;
            }
            n.encryptBlock(i, 0);
            for (var s = 0; s < o; s++) {
                e[t + s] ^= i[s];
            }
        }
    });
    a.Decryptor = c;
    l.mode.OFB = a;
    l.pad.NoPadding = {
        pad: function () {
        },
        unpad: function () {
        }
    };
    (function (e) {
        var n = l.lib.CipherParams;
        var o = l.enc.Hex;
        l.format.Hex = {
            stringify: function (e) {
                return e.ciphertext.toString(o);
            },
            parse: function (e) {
                var t = o.parse(e);
                return n.create({ ciphertext: t });
            }
        };
    }());
    (function () {
        var t = l.lib.BlockCipher;
        var n = l.algo;
        var o = [];
        var r = [];
        var i = [];
        var s = [];
        var a = [];
        var c = [];
        var d = [];
        var u = [];
        var f = [];
        var h = [];
        !function () {
            var e = [];
            for (var t = 0; t < 256; t++) {
                e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
            }
            var n = 0;
            var l = 0;
            for (t = 0; t < 256; t++) {
                var w = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4;
                w = w >>> 8 ^ 255 & w ^ 99;
                o[n] = w;
                r[w] = n;
                var g = e[n];
                var p = e[g];
                var m = e[p];
                var v = 257 * e[w] ^ 16843008 * w;
                ;
                s[n] = v << 16 | v >>> 16;
                a[n] = v << 8 | v >>> 24;
                c[n] = v;
                v = 16843009 * m ^ 65537 * p ^ 257 * g ^ 16843008 * n;
                d[w] = v << 24 | v >>> 8;
                u[w] = v << 16 | v >>> 16;
                f[w] = v << 8 | v >>> 24;
                h[w] = v;
                if (n) {
                    n = g ^ e[e[e[m ^ g]]];
                    l ^= e[e[l]];
                } else {
                    n = l = 1;
                }
            }
        }();
        var w = [
            0,
            1,
            2,
            4,
            8,
            16,
            32,
            64,
            128,
            27,
            54
        ];
        var g = n.AES = t.extend({
            _doReset: function () {
                if (!this._nRounds || this._keyPriorReset !== this._key) {
                    var e = this._keyPriorReset = this._key;
                    var t = e.words;
                    var n = e.sigBytes / 4;
                    var r = 4 * ((this._nRounds = n + 6) + 1);
                    var i = this._keySchedule = [];
                    for (var s = 0; s < r; s++) {
                        if (s < n) {
                            ;
                        } else {
                            l = i[s - 1];
                            if (s % n) {
                                if (n > 6 && s % n == 4) {
                                    l = o[l >>> 24] << 24 | o[l >>> 16 & 255] << 16 | o[l >>> 8 & 255] << 8 | o[255 & l];
                                }
                            } else {
                                l = o[(l = l << 8 | l >>> 24) >>> 24] << 24 | o[l >>> 16 & 255] << 16 | o[l >>> 8 & 255] << 8 | o[255 & l];
                                l ^= w[s / n | 0] << 24;
                            }
                            ;
                        }
                    }
                    var a = this._invKeySchedule = [];
                    for (var c = 0; c < r; c++) {
                        s = r - c;
                        if (c % 4) {
                            var l = i[s];
                        } else {
                            l = i[s - 4];
                        }
                        a[c] = c < 4 || s <= 4 ? l : d[o[l >>> 24]] ^ u[o[l >>> 16 & 255]] ^ f[o[l >>> 8 & 255]] ^ h[o[255 & l]];
                    }
                }
            },
            encryptBlock: function (e, t) {
                this._doCryptBlock(e, t, this._keySchedule, i, s, a, c, o);
            },
            decryptBlock: function (e, t) {
                var n = e[t + 1];
                e[t + 1] = e[t + 3];
                e[t + 3] = n;
                this._doCryptBlock(e, t, this._invKeySchedule, d, u, f, h, r);
                n = e[t + 1];
                e[t + 1] = e[t + 3];
                e[t + 3] = n;
            },
            _doCryptBlock: function (e, t, n, o, r, i, s, a) {
                var c = this._nRounds;
                var l = e[t] ^ n[0];
                var d = e[t + 1] ^ n[1];
                var u = e[t + 2] ^ n[2];
                var f = e[t + 3] ^ n[3];
                var h = 4;
                for (var w = 1; w < c; w++) {
                    var g = o[l >>> 24] ^ r[d >>> 16 & 255] ^ i[u >>> 8 & 255] ^ s[255 & f] ^ n[h++];
                    var p = o[d >>> 24] ^ r[u >>> 16 & 255] ^ i[f >>> 8 & 255] ^ s[255 & l] ^ n[h++];
                    var m = o[u >>> 24] ^ r[f >>> 16 & 255] ^ i[l >>> 8 & 255] ^ s[255 & d] ^ n[h++];
                    var v = o[f >>> 24] ^ r[l >>> 16 & 255] ^ i[d >>> 8 & 255] ^ s[255 & u] ^ n[h++];
                    l = g;
                    d = p;
                    u = m;
                    f = v;
                }
                g = (a[l >>> 24] << 24 | a[d >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & f]) ^ n[h++];
                p = (a[d >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[f >>> 8 & 255] << 8 | a[255 & l]) ^ n[h++];
                m = (a[u >>> 24] << 24 | a[f >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & d]) ^ n[h++];
                v = (a[f >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[d >>> 8 & 255] << 8 | a[255 & u]) ^ n[h++];
                e[t] = g;
                e[t + 1] = p;
                e[t + 2] = m;
                e[t + 3] = v;
            },
            keySize: 8
        });
        l.AES = t._createHelper(g);
    }());
    (function () {
        var t = l.lib;
        var n = t.WordArray;
        var o = t.BlockCipher;
        var r = l.algo;
        var i = [
            57,
            49,
            41,
            33,
            25,
            17,
            9,
            1,
            58,
            50,
            42,
            34,
            26,
            18,
            10,
            2,
            59,
            51,
            43,
            35,
            27,
            19,
            11,
            3,
            60,
            52,
            44,
            36,
            63,
            55,
            47,
            39,
            31,
            23,
            15,
            7,
            62,
            54,
            46,
            38,
            30,
            22,
            14,
            6,
            61,
            53,
            45,
            37,
            29,
            21,
            13,
            5,
            28,
            20,
            12,
            4
        ];
        var s = [
            14,
            17,
            11,
            24,
            1,
            5,
            3,
            28,
            15,
            6,
            21,
            10,
            23,
            19,
            12,
            4,
            26,
            8,
            16,
            7,
            27,
            20,
            13,
            2,
            41,
            52,
            31,
            37,
            47,
            55,
            30,
            40,
            51,
            45,
            33,
            48,
            44,
            49,
            39,
            56,
            34,
            53,
            46,
            42,
            50,
            36,
            29,
            32
        ];
        var a = [
            1,
            2,
            4,
            6,
            8,
            10,
            12,
            14,
            15,
            17,
            19,
            21,
            23,
            25,
            27,
            28
        ];
        var c = [
            {
                0: 8421888,
                268435456: 32768,
                536870912: 8421378,
                805306368: 2,
                1073741824: 512,
                1342177280: 8421890,
                1610612736: 8389122,
                1879048192: 8388608,
                2147483648: 514,
                2415919104: 8389120,
                2684354560: 33280,
                2952790016: 8421376,
                3221225472: 32770,
                3489660928: 8388610,
                3758096384: 0,
                4026531840: 33282,
                134217728: 0,
                402653184: 8421890,
                671088640: 33282,
                939524096: 32768,
                1207959552: 8421888,
                1476395008: 512,
                1744830464: 8421378,
                2013265920: 2,
                2281701376: 8389120,
                2550136832: 33280,
                2818572288: 8421376,
                3087007744: 8389122,
                3355443200: 8388610,
                3623878656: 32770,
                3892314112: 514,
                4160749568: 8388608,
                1: 32768,
                268435457: 2,
                536870913: 8421888,
                805306369: 8388608,
                1073741825: 8421378,
                1342177281: 33280,
                1610612737: 512,
                1879048193: 8389122,
                2147483649: 8421890,
                2415919105: 8421376,
                2684354561: 8388610,
                2952790017: 33282,
                3221225473: 514,
                3489660929: 8389120,
                3758096385: 32770,
                4026531841: 0,
                134217729: 8421890,
                402653185: 8421376,
                671088641: 8388608,
                939524097: 512,
                1207959553: 32768,
                1476395009: 8388610,
                1744830465: 2,
                2013265921: 33282,
                2281701377: 32770,
                2550136833: 8389122,
                2818572289: 514,
                3087007745: 8421888,
                3355443201: 8389120,
                3623878657: 0,
                3892314113: 33280,
                4160749569: 8421378
            },
            {
                0: 1074282512,
                16777216: 16384,
                33554432: 524288,
                50331648: 1074266128,
                67108864: 1073741840,
                83886080: 1074282496,
                100663296: 1073758208,
                117440512: 16,
                134217728: 540672,
                150994944: 1073758224,
                167772160: 1073741824,
                184549376: 540688,
                201326592: 524304,
                218103808: 0,
                234881024: 16400,
                251658240: 1074266112,
                8388608: 1073758208,
                25165824: 540688,
                41943040: 16,
                58720256: 1073758224,
                75497472: 1074282512,
                92274688: 1073741824,
                109051904: 524288,
                125829120: 1074266128,
                142606336: 524304,
                159383552: 0,
                176160768: 16384,
                192937984: 1074266112,
                209715200: 1073741840,
                226492416: 540672,
                243269632: 1074282496,
                260046848: 16400,
                268435456: 0,
                285212672: 1074266128,
                301989888: 1073758224,
                318767104: 1074282496,
                335544320: 1074266112,
                352321536: 16,
                369098752: 540688,
                385875968: 16384,
                402653184: 16400,
                419430400: 524288,
                436207616: 524304,
                452984832: 1073741840,
                469762048: 540672,
                486539264: 1073758208,
                503316480: 1073741824,
                520093696: 1074282512,
                276824064: 540688,
                293601280: 524288,
                310378496: 1074266112,
                327155712: 16384,
                343932928: 1073758208,
                360710144: 1074282512,
                377487360: 16,
                394264576: 1073741824,
                411041792: 1074282496,
                427819008: 1073741840,
                444596224: 1073758224,
                461373440: 524304,
                478150656: 0,
                494927872: 16400,
                511705088: 1074266128,
                528482304: 540672
            },
            {
                0: 260,
                1048576: 0,
                2097152: 67109120,
                3145728: 65796,
                4194304: 65540,
                5242880: 67108868,
                6291456: 67174660,
                7340032: 67174400,
                8388608: 67108864,
                9437184: 67174656,
                10485760: 65792,
                11534336: 67174404,
                12582912: 67109124,
                13631488: 65536,
                14680064: 4,
                15728640: 256,
                524288: 67174656,
                1572864: 67174404,
                2621440: 0,
                3670016: 67109120,
                4718592: 67108868,
                5767168: 65536,
                6815744: 65540,
                7864320: 260,
                8912896: 4,
                9961472: 256,
                11010048: 67174400,
                12058624: 65796,
                13107200: 65792,
                14155776: 67109124,
                15204352: 67174660,
                16252928: 67108864,
                16777216: 67174656,
                17825792: 65540,
                18874368: 65536,
                19922944: 67109120,
                20971520: 256,
                22020096: 67174660,
                23068672: 67108868,
                24117248: 0,
                25165824: 67109124,
                26214400: 67108864,
                27262976: 4,
                28311552: 65792,
                29360128: 67174400,
                30408704: 260,
                31457280: 65796,
                32505856: 67174404,
                17301504: 67108864,
                18350080: 260,
                19398656: 67174656,
                20447232: 0,
                21495808: 65540,
                22544384: 67109120,
                23592960: 256,
                24641536: 67174404,
                25690112: 65536,
                26738688: 67174660,
                27787264: 65796,
                28835840: 67108868,
                29884416: 67109124,
                30932992: 67174400,
                31981568: 4,
                33030144: 65792
            },
            {
                0: 2151682048,
                65536: 2147487808,
                131072: 4198464,
                196608: 2151677952,
                262144: 0,
                327680: 4198400,
                393216: 2147483712,
                458752: 4194368,
                524288: 2147483648,
                589824: 4194304,
                655360: 64,
                720896: 2147487744,
                786432: 2151678016,
                851968: 4160,
                917504: 4096,
                983040: 2151682112,
                32768: 2147487808,
                98304: 64,
                163840: 2151678016,
                229376: 2147487744,
                294912: 4198400,
                360448: 2151682112,
                425984: 0,
                491520: 2151677952,
                557056: 4096,
                622592: 2151682048,
                688128: 4194304,
                753664: 4160,
                819200: 2147483648,
                884736: 4194368,
                950272: 4198464,
                1015808: 2147483712,
                1048576: 4194368,
                1114112: 4198400,
                1179648: 2147483712,
                1245184: 0,
                1310720: 4160,
                1376256: 2151678016,
                1441792: 2151682048,
                1507328: 2147487808,
                1572864: 2151682112,
                1638400: 2147483648,
                1703936: 2151677952,
                1769472: 4198464,
                1835008: 2147487744,
                1900544: 4194304,
                1966080: 64,
                2031616: 4096,
                1081344: 2151677952,
                1146880: 2151682112,
                1212416: 0,
                1277952: 4198400,
                1343488: 4194368,
                1409024: 2147483648,
                1474560: 2147487808,
                1540096: 64,
                1605632: 2147483712,
                1671168: 4096,
                1736704: 2147487744,
                1802240: 2151678016,
                1867776: 4160,
                1933312: 2151682048,
                1998848: 4194304,
                2064384: 4198464
            },
            {
                0: 128,
                4096: 17039360,
                8192: 262144,
                12288: 536870912,
                16384: 537133184,
                20480: 16777344,
                24576: 553648256,
                28672: 262272,
                32768: 16777216,
                36864: 537133056,
                40960: 536871040,
                45056: 553910400,
                49152: 553910272,
                53248: 0,
                57344: 17039488,
                61440: 553648128,
                2048: 17039488,
                6144: 553648256,
                10240: 128,
                14336: 17039360,
                18432: 262144,
                22528: 537133184,
                26624: 553910272,
                30720: 536870912,
                34816: 537133056,
                38912: 0,
                43008: 553910400,
                47104: 16777344,
                51200: 536871040,
                55296: 553648128,
                59392: 16777216,
                63488: 262272,
                65536: 262144,
                69632: 128,
                73728: 536870912,
                77824: 553648256,
                81920: 16777344,
                86016: 553910272,
                90112: 537133184,
                94208: 16777216,
                98304: 553910400,
                102400: 553648128,
                106496: 17039360,
                110592: 537133056,
                114688: 262272,
                118784: 536871040,
                122880: 0,
                126976: 17039488,
                67584: 553648256,
                71680: 16777216,
                75776: 17039360,
                79872: 537133184,
                83968: 536870912,
                88064: 17039488,
                92160: 128,
                96256: 553910272,
                100352: 262272,
                104448: 553910400,
                108544: 0,
                112640: 553648128,
                116736: 16777344,
                120832: 262144,
                124928: 537133056,
                129024: 536871040
            },
            {
                0: 268435464,
                256: 8192,
                512: 270532608,
                768: 270540808,
                1024: 268443648,
                1280: 2097152,
                1536: 2097160,
                1792: 268435456,
                2048: 0,
                2304: 268443656,
                2560: 2105344,
                2816: 8,
                3072: 270532616,
                3328: 2105352,
                3584: 8200,
                3840: 270540800,
                128: 270532608,
                384: 270540808,
                640: 8,
                896: 2097152,
                1152: 2105352,
                1408: 268435464,
                1664: 268443648,
                1920: 8200,
                2176: 2097160,
                2432: 8192,
                2688: 268443656,
                2944: 270532616,
                3200: 0,
                3456: 270540800,
                3712: 2105344,
                3968: 268435456,
                4096: 268443648,
                4352: 270532616,
                4608: 270540808,
                4864: 8200,
                5120: 2097152,
                5376: 268435456,
                5632: 268435464,
                5888: 2105344,
                6144: 2105352,
                6400: 0,
                6656: 8,
                6912: 270532608,
                7168: 8192,
                7424: 268443656,
                7680: 270540800,
                7936: 2097160,
                4224: 8,
                4480: 2105344,
                4736: 2097152,
                4992: 268435464,
                5248: 268443648,
                5504: 8200,
                5760: 270540808,
                6016: 270532608,
                6272: 270540800,
                6528: 270532616,
                6784: 8192,
                7040: 2105352,
                7296: 2097160,
                7552: 0,
                7808: 268435456,
                8064: 268443656
            },
            {
                0: 1048576,
                16: 33555457,
                32: 1024,
                48: 1049601,
                64: 34604033,
                80: 0,
                96: 1,
                112: 34603009,
                128: 33555456,
                144: 1048577,
                160: 33554433,
                176: 34604032,
                192: 34603008,
                208: 1025,
                224: 1049600,
                240: 33554432,
                8: 34603009,
                24: 0,
                40: 33555457,
                56: 34604032,
                72: 1048576,
                88: 33554433,
                104: 33554432,
                120: 1025,
                136: 1049601,
                152: 33555456,
                168: 34603008,
                184: 1048577,
                200: 1024,
                216: 34604033,
                232: 1,
                248: 1049600,
                256: 33554432,
                272: 1048576,
                288: 33555457,
                304: 34603009,
                320: 1048577,
                336: 33555456,
                352: 34604032,
                368: 1049601,
                384: 1025,
                400: 34604033,
                416: 1049600,
                432: 1,
                448: 0,
                464: 34603008,
                480: 33554433,
                496: 1024,
                264: 1049600,
                280: 33555457,
                296: 34603009,
                312: 1,
                328: 33554432,
                344: 1048576,
                360: 1025,
                376: 34604032,
                392: 33554433,
                408: 34603008,
                424: 0,
                440: 34604033,
                456: 1049601,
                472: 1024,
                488: 33555456,
                504: 1048577
            },
            {
                0: 134219808,
                1: 131072,
                2: 134217728,
                3: 32,
                4: 131104,
                5: 134350880,
                6: 134350848,
                7: 2048,
                8: 134348800,
                9: 134219776,
                10: 133120,
                11: 134348832,
                12: 2080,
                13: 0,
                14: 134217760,
                15: 133152,
                2147483648: 2048,
                2147483649: 134350880,
                2147483650: 134219808,
                2147483651: 134217728,
                2147483652: 134348800,
                2147483653: 133120,
                2147483654: 133152,
                2147483655: 32,
                2147483656: 134217760,
                2147483657: 2080,
                2147483658: 131104,
                2147483659: 134350848,
                2147483660: 0,
                2147483661: 134348832,
                2147483662: 134219776,
                2147483663: 131072,
                16: 133152,
                17: 134350848,
                18: 32,
                19: 2048,
                20: 134219776,
                21: 134217760,
                22: 134348832,
                23: 131072,
                24: 0,
                25: 131104,
                26: 134348800,
                27: 134219808,
                28: 134350880,
                29: 133120,
                30: 2080,
                31: 134217728,
                2147483664: 131072,
                2147483665: 2048,
                2147483666: 134348832,
                2147483667: 133152,
                2147483668: 32,
                2147483669: 134348800,
                2147483670: 134217728,
                2147483671: 134219808,
                2147483672: 134350880,
                2147483673: 134217760,
                2147483674: 134219776,
                2147483675: 0,
                2147483676: 133120,
                2147483677: 2080,
                2147483678: 131104,
                2147483679: 134350848
            }
        ];
        var d = [
            4160749569,
            528482304,
            33030144,
            2064384,
            129024,
            8064,
            504,
            2147483679
        ];
        var u = r.DES = o.extend({
            _doReset: function () {
                var e = this._key.words;
                var t = [];
                for (var n = 0; n < 56; n++) {
                    var o = i[n] - 1;
                    t[n] = e[o >>> 5] >>> 31 - o % 32 & 1;
                }
                var r = this._subKeys = [];
                for (var c = 0; c < 16; c++) {
                    var l = r[c] = [];
                    var d = a[c];
                    for (n = 0; n < 24; n++) {
                        l[n / 6 | 0] |= t[(s[n] - 1 + d) % 28] << 31 - n % 6;
                        l[4 + (n / 6 | 0)] |= t[28 + (s[n + 24] - 1 + d) % 28] << 31 - n % 6;
                    }
                    l[0] = l[0] << 1 | l[0] >>> 31;
                    for (n = 1; n < 7; n++) {
                        l[n] = l[n] >>> 4 * (n - 1) + 3;
                    }
                    l[7] = l[7] << 5 | l[7] >>> 27;
                }
                var u = this._invSubKeys = [];
                for (n = 0; n < 16; n++) {
                    u[n] = r[15 - n];
                }
            },
            encryptBlock: function (e, t) {
                this._doCryptBlock(e, t, this._subKeys);
            },
            decryptBlock: function (e, t) {
                this._doCryptBlock(e, t, this._invSubKeys);
            },
            _doCryptBlock: function (e, t, n) {
                this._lBlock = e[t];
                this._rBlock = e[t + 1];
                f.call(this, 4, 252645135);
                f.call(this, 16, 65535);
                h.call(this, 2, 858993459);
                h.call(this, 8, 16711935);
                f.call(this, 1, 1431655765);
                for (var o = 0; o < 16; o++) {
                    var r = n[o];
                    var i = this._lBlock;
                    var s = this._rBlock;
                    var a = 0;
                    for (var l = 0; l < 8; l++) {
                        a |= c[l][((s ^ r[l]) & d[l]) >>> 0];
                    }
                    this._lBlock = s;
                    this._rBlock = i ^ a;
                }
                var u = this._lBlock;
                this._lBlock = this._rBlock;
                this._rBlock = u;
                f.call(this, 1, 1431655765);
                h.call(this, 8, 16711935);
                h.call(this, 2, 858993459);
                f.call(this, 16, 65535);
                f.call(this, 4, 252645135);
                e[t] = this._lBlock;
                e[t + 1] = this._rBlock;
            },
            keySize: 2,
            ivSize: 2,
            blockSize: 2
        });
        function f(e, t) {
            var n = (this._lBlock >>> e ^ this._rBlock) & t;
            this._rBlock ^= n;
            this._lBlock ^= n << e;
        }
        function h(e, t) {
            var n = (this._rBlock >>> e ^ this._lBlock) & t;
            this._lBlock ^= n;
            this._rBlock ^= n << e;
        }
        l.DES = o._createHelper(u);
        var w = r.TripleDES = o.extend({
            _doReset: function () {
                var e = this._key.words;
                if (2 !== e.length && 4 !== e.length && e.length < 6) {
                    throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
                }
                var t = e.slice(0, 2);
                var o = e.length < 4 ? e.slice(0, 2) : e.slice(2, 4);
                var r = e.length < 6 ? e.slice(0, 2) : e.slice(4, 6);
                this._des1 = u.createEncryptor(n.create(t));
                this._des2 = u.createEncryptor(n.create(o));
                this._des3 = u.createEncryptor(n.create(r));
            },
            encryptBlock: function (e, t) {
                this._des1.encryptBlock(e, t);
                this._des2.decryptBlock(e, t);
                this._des3.encryptBlock(e, t);
            },
            decryptBlock: function (e, t) {
                this._des3.decryptBlock(e, t);
                this._des2.encryptBlock(e, t);
                this._des1.decryptBlock(e, t);
            },
            keySize: 6,
            ivSize: 2,
            blockSize: 2
        });
        l.TripleDES = o._createHelper(w);
    }());
    (function () {
        var t = l.lib.StreamCipher;
        var n = l.algo;
        var o = n.RC4 = t.extend({
            _doReset: function () {
                var e = this._key;
                var t = e.words;
                var n = e.sigBytes;
                var o = this._S = [];
                for (var r = 0; r < 256; r++) {
                    o[r] = r;
                }
                r = 0;
                for (var i = 0; r < 256; r++) {
                    var s = r % n;
                    var a = t[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                    i = (i + o[r] + a) % 256;
                    var c = o[r];
                    o[r] = o[i];
                    o[i] = c;
                }
                this._i = this._j = 0;
            },
            _doProcessBlock: function (e, t) {
                e[t] ^= r.call(this);
            },
            keySize: 8,
            ivSize: 0
        });
        function r() {
            var e = this._S;
            var t = this._i;
            var n = this._j;
            var o = 0;
            for (var r = 0; r < 4; r++) {
                n = (n + e[t = (t + 1) % 256]) % 256;
                var i = e[t];
                e[t] = e[n];
                e[n] = i;
                o |= e[(e[t] + e[n]) % 256] << 24 - 8 * r;
            }
            this._i = t;
            this._j = n;
            return o;
        }
        l.RC4 = t._createHelper(o);
        var i = n.RC4Drop = o.extend({
            cfg: o.cfg.extend({ drop: 192 }),
            _doReset: function () {
                o._doReset.call(this);
                for (var e = this.cfg.drop; e > 0; e--) {
                    r.call(this);
                }
            }
        });
        l.RC4Drop = t._createHelper(i);
    }());
    l.mode.CTRGladman = function () {
        var e = l.lib.BlockCipherMode.extend();
        function t(e) {
            if (255 == (e >> 24 & 255)) {
                var t = e >> 16 & 255;
                var n = e >> 8 & 255;
                var o = 255 & e;
                if (255 === t) {
                    t = 0;
                    if (255 === n) {
                        n = 0;
                        if (255 === o) {
                            o = 0;
                        } else {
                            ++o;
                        }
                    } else {
                        ++n;
                    }
                } else {
                    ++t;
                }
                e = 0;
                e += t << 16;
                e += n << 8;
                e += o;
            } else {
                e += 16777216;
            }
            return e;
        }
        var n = e.Encryptor = e.extend({
            processBlock: function (e, n) {
                var o = this._cipher;
                var r = o.blockSize;
                var i = this._iv;
                var s = this._counter;
                if (i) {
                    s = this._counter = i.slice(0);
                    this._iv = undefined;
                }
                (function (e) {
                    if (0 === (e[0] = t(e[0]))) {
                        e[1] = t(e[1]);
                    }
                }(s));
                var a = s.slice(0);
                o.encryptBlock(a, 0);
                for (var c = 0; c < r; c++) {
                    e[n + c] ^= a[c];
                }
            }
        });
        e.Decryptor = n;
        return e;
    }();
    (function () {
        var t = l.lib.StreamCipher;
        var n = [];
        var o = [];
        var r = [];
        var i = l.algo.Rabbit = t.extend({
            _doReset: function () {
                var e = this._key.words;
                var t = this.cfg.iv;
                for (var n = 0; n < 4; n++) {
                    e[n] = 16711935 & (e[n] << 8 | e[n] >>> 24) | 4278255360 & (e[n] << 24 | e[n] >>> 8);
                }
                var o = this._X = [
                    e[0],
                    e[3] << 16 | e[2] >>> 16,
                    e[1],
                    e[0] << 16 | e[3] >>> 16,
                    e[2],
                    e[1] << 16 | e[0] >>> 16,
                    e[3],
                    e[2] << 16 | e[1] >>> 16
                ];
                var r = this._C = [
                    e[2] << 16 | e[2] >>> 16,
                    4294901760 & e[0] | 65535 & e[1],
                    e[3] << 16 | e[3] >>> 16,
                    4294901760 & e[1] | 65535 & e[2],
                    e[0] << 16 | e[0] >>> 16,
                    4294901760 & e[2] | 65535 & e[3],
                    e[1] << 16 | e[1] >>> 16,
                    4294901760 & e[3] | 65535 & e[0]
                ];
                this._b = 0;
                for (n = 0; n < 4; n++) {
                    s.call(this);
                }
                for (n = 0; n < 8; n++) {
                    r[n] ^= o[n + 4 & 7];
                }
                if (t) {
                    var i = t.words;
                    var a = i[0];
                    var c = i[1];
                    var l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
                    var d = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8);
                    var u = l >>> 16 | 4294901760 & d;
                    var f = d << 16 | 65535 & l;
                    r[0] ^= l;
                    r[1] ^= u;
                    r[2] ^= d;
                    r[3] ^= f;
                    r[4] ^= l;
                    r[5] ^= u;
                    r[6] ^= d;
                    r[7] ^= f;
                    for (n = 0; n < 4; n++) {
                        s.call(this);
                    }
                }
            },
            _doProcessBlock: function (e, t) {
                var o = this._X;
                s.call(this);
                n[0] = o[0] ^ o[5] >>> 16 ^ o[3] << 16;
                n[1] = o[2] ^ o[7] >>> 16 ^ o[5] << 16;
                n[2] = o[4] ^ o[1] >>> 16 ^ o[7] << 16;
                n[3] = o[6] ^ o[3] >>> 16 ^ o[1] << 16;
                for (var r = 0; r < 4; r++) {
                    n[r] = 16711935 & (n[r] << 8 | n[r] >>> 24) | 4278255360 & (n[r] << 24 | n[r] >>> 8);
                    e[t + r] ^= n[r];
                }
            },
            blockSize: 4,
            ivSize: 2
        });
        function s() {
            var e = this._X;
            var t = this._C;
            for (var n = 0; n < 8; n++) {
                o[n] = t[n];
            }
            t[0] = t[0] + 1295307597 + this._b | 0;
            t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0;
            t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0;
            t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0;
            t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0;
            t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0;
            t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0;
            t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0;
            this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0;
            for (n = 0; n < 8; n++) {
                var i = e[n] + t[n];
                var s = 65535 & i;
                var a = i >>> 16;
                var c = ((s * s >>> 17) + s * a >>> 15) + a * a;
                var l = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                r[n] = c ^ l;
            }
            e[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0;
            e[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0;
            e[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0;
            e[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0;
            e[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0;
            e[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0;
            e[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0;
            e[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0;
        }
        l.Rabbit = t._createHelper(i);
    }());
    l.mode.CTR = function () {
        var e = l.lib.BlockCipherMode.extend();
        var t = e.Encryptor = e.extend({
            processBlock: function (e, t) {
                var n = this._cipher;
                var o = n.blockSize;
                var r = this._iv;
                var i = this._counter;
                if (r) {
                    i = this._counter = r.slice(0);
                    this._iv = undefined;
                }
                var s = i.slice(0);
                n.encryptBlock(s, 0);
                i[o - 1] = i[o - 1] + 1 | 0;
                for (var a = 0; a < o; a++) {
                    e[t + a] ^= s[a];
                }
            }
        });
        e.Decryptor = t;
        return e;
    }();
    (function () {
        var t = l.lib.StreamCipher;
        var n = [];
        var o = [];
        var r = [];
        var i = l.algo.RabbitLegacy = t.extend({
            _doReset: function () {
                var e = this._key.words;
                var t = this.cfg.iv;
                var n = this._X = [
                    e[0],
                    e[3] << 16 | e[2] >>> 16,
                    e[1],
                    e[0] << 16 | e[3] >>> 16,
                    e[2],
                    e[1] << 16 | e[0] >>> 16,
                    e[3],
                    e[2] << 16 | e[1] >>> 16
                ];
                var o = this._C = [
                    e[2] << 16 | e[2] >>> 16,
                    4294901760 & e[0] | 65535 & e[1],
                    e[3] << 16 | e[3] >>> 16,
                    4294901760 & e[1] | 65535 & e[2],
                    e[0] << 16 | e[0] >>> 16,
                    4294901760 & e[2] | 65535 & e[3],
                    e[1] << 16 | e[1] >>> 16,
                    4294901760 & e[3] | 65535 & e[0]
                ];
                this._b = 0;
                for (var r = 0; r < 4; r++) {
                    s.call(this);
                }
                for (r = 0; r < 8; r++) {
                    o[r] ^= n[r + 4 & 7];
                }
                if (t) {
                    var i = t.words;
                    var a = i[0];
                    var c = i[1];
                    var l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
                    var d = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8);
                    var u = l >>> 16 | 4294901760 & d;
                    var f = d << 16 | 65535 & l;
                    o[0] ^= l;
                    o[1] ^= u;
                    o[2] ^= d;
                    o[3] ^= f;
                    o[4] ^= l;
                    o[5] ^= u;
                    o[6] ^= d;
                    o[7] ^= f;
                    for (r = 0; r < 4; r++) {
                        s.call(this);
                    }
                }
            },
            _doProcessBlock: function (e, t) {
                var o = this._X;
                s.call(this);
                n[0] = o[0] ^ o[5] >>> 16 ^ o[3] << 16;
                n[1] = o[2] ^ o[7] >>> 16 ^ o[5] << 16;
                n[2] = o[4] ^ o[1] >>> 16 ^ o[7] << 16;
                n[3] = o[6] ^ o[3] >>> 16 ^ o[1] << 16;
                for (var r = 0; r < 4; r++) {
                    n[r] = 16711935 & (n[r] << 8 | n[r] >>> 24) | 4278255360 & (n[r] << 24 | n[r] >>> 8);
                    e[t + r] ^= n[r];
                }
            },
            blockSize: 4,
            ivSize: 2
        });
        function s() {
            var e = this._X;
            var t = this._C;
            for (var n = 0; n < 8; n++) {
                o[n] = t[n];
            }
            t[0] = t[0] + 1295307597 + this._b | 0;
            t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0;
            t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0;
            t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0;
            t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0;
            t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0;
            t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0;
            t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0;
            this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0;
            for (n = 0; n < 8; n++) {
                var i = e[n] + t[n];
                var s = 65535 & i;
                var a = i >>> 16;
                var c = ((s * s >>> 17) + s * a >>> 15) + a * a;
                var l = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                r[n] = c ^ l;
            }
            e[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0;
            e[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0;
            e[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0;
            e[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0;
            e[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0;
            e[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0;
            e[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0;
            e[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0;
        }
        l.RabbitLegacy = t._createHelper(i);
    }());
    l.pad.ZeroPadding = {
        pad: function (e, t) {
            var n = 4 * t;
            e.clamp();
            e.sigBytes += n - (e.sigBytes % n || n);
        },
        unpad: function (e) {
            var t = e.words;
            var n = e.sigBytes - 1;
            for (n = e.sigBytes - 1; n >= 0; n--) {
                if (t[n >>> 2] >>> 24 - n % 4 * 8 & 255) {
                    e.sigBytes = n + 1;
                    break;
                }
            }
        }
    };
    return l;
});
(function e(t, n, o) {
    function r(s, a) {
        if (!n[s]) {
            if (!t[s]) {
                var c = 'function' == typeof require && require;
                if (!a && c) {
                    return c(s, true);
                }
                if (i) {
                    return i(s, true);
                }
                var l = new Error('Cannot find module \'' + s + '\'');
                l.code = 'MODULE_NOT_FOUND';
                throw l;
            }
            var d = n[s] = { exports: {} };
            t[s][0].call(d.exports, function (e) {
                return r(t[s][1][e] || e);
            }, d, d.exports, e, t, n, o);
        }
        return n[s].exports;
    }
    var i = 'function' == typeof require && require;
    for (var s = 0; s < o.length; s++) {
        r(o[s]);
    }
    return r;
}({
    1: [
        function (e, t, n) {
            !function (o) {
                'use strict';
                var r = function (e, t, n) {
                    this.low = 0 | e;
                    this.high = 0 | t;
                    this.unsigned = !!n;
                };
                r.isLong = function (e) {
                    return true === (e && e instanceof r);
                };
                var i = {};
                var s = { unsigned: t };
                r.fromInt = function (e, t) {
                    var n;
                    var o;
                    return t ? 0 <= (e >>>= 0) && e < 256 && (o = s[e]) ? o : (n = new r(e, (0 | e) < 0 ? -1 : 0, true), 0 <= e && e < 256 && (s[e] = n), n) : -128 <= (e |= 0) && e < 128 && (o = i[e]) ? o : (n = new r(e, e < 0 ? -1 : 0, false), -128 <= e && e < 128 && (i[e] = n), n);
                };
                r.fromNumber = function (e, t) {
                    t = !!t;
                    return isNaN(e) || !isFinite(e) ? r.ZERO : !t && e <= -9223372036854776000 ? r.MIN_VALUE : !t && 9223372036854776000 <= e + 1 ? r.MAX_VALUE : t && 18446744073709552000 <= e ? r.MAX_UNSIGNED_VALUE : e < 0 ? r.fromNumber(-e, t).negate() : new r(e % 4294967296 | 0, e / 4294967296 | 0, t);
                };
                r.fromBits = function (e, t, n) {
                    return new r(e, t, n);
                };
                r.fromString = function (e, t, n) {
                    if (0 === e.length) {
                        throw Error('number format error: empty string');
                    }
                    if ('NaN' === e || 'Infinity' === e || '+Infinity' === e || '-Infinity' === e) {
                        return r.ZERO;
                    }
                    if ('number' == typeof t) {
                        n = t;
                        t = false;
                    }
                    if ((n = n || 10) < 2 || 36 < n) {
                        throw Error('radix out of range: ' + n);
                    }
                    var o;
                    if (0 < (o = e.indexOf('-'))) {
                        throw Error('number format error: interior "-" character: ' + e);
                    }
                    if (0 === o) {
                        return r.fromString(e.substring(1), t, n).negate();
                    }
                    var i = r.fromNumber(Math.pow(n, 8));
                    var s = r.ZERO;
                    for (var a = 0; a < e.length; a += 8) {
                        var c = Math.min(8, e.length - a);
                        var l = parseInt(e.substring(a, a + c), n);
                        if (c < 8) {
                            var d = r.fromNumber(Math.pow(n, c));
                            s = s.multiply(d).add(r.fromNumber(l));
                        } else {
                            s = (s = s.multiply(i)).add(r.fromNumber(l));
                        }
                    }
                    ;
                    return s;
                };
                r.fromValue = function (e) {
                    return 'number' == typeof e ? r.fromNumber(e) : 'string' == typeof e ? r.fromString(e) : r.isLong(e) ? e : new r(e.low, e.high, e.unsigned);
                };
                var d = r.fromInt(16777216);
                r.ZERO = r.fromInt(0);
                r.UZERO = r.fromInt(0, true);
                r.ONE = r.fromInt(1);
                r.UONE = r.fromInt(1, true);
                r.NEG_ONE = r.fromInt(-1);
                r.MAX_VALUE = r.fromBits(-1, 2147483647, false);
                r.MAX_UNSIGNED_VALUE = r.fromBits(-1, -1, true);
                r.MIN_VALUE = r.fromBits(0, -2147483648, false);
                r.prototype.toInt = function () {
                    return this.unsigned ? this.low >>> 0 : this.low;
                };
                r.prototype.toNumber = function () {
                    return this.unsigned ? (this.high >>> 0) * 4294967296 + (this.low >>> 0) : this.high * 4294967296 + (this.low >>> 0);
                };
                r.prototype.toString = function (e) {
                    if ((e = e || 10) < 2 || 36 < e) {
                        throw RangeError('radix out of range: ' + e);
                    }
                    if (this.isZero()) {
                        return '0';
                    }
                    var t;
                    if (this.isNegative()) {
                        if (this.equals(r.MIN_VALUE)) {
                            var n = r.fromNumber(e);
                            var o = this.div(n);
                            t = o.multiply(n).subtract(this);
                            return o.toString(e) + t.toInt().toString(e);
                        }
                        return '-' + this.negate().toString(e);
                    }
                    var i = r.fromNumber(Math.pow(e, 6), this.unsigned);
                    t = this;
                    for (var s = '';;) {
                        var a = t.div(i);
                        var c = (t.subtract(a.multiply(i)).toInt() >>> 0).toString(e);
                        if ((t = a).isZero()) {
                            return c + s;
                        }
                        for (; c.length < 6;) {
                            c = '0' + c;
                        }
                        s = '' + c + s;
                    }
                };
                r.prototype.getHighBits = function () {
                    return this.high;
                };
                r.prototype.getHighBitsUnsigned = function () {
                    return this.high >>> 0;
                };
                r.prototype.getLowBits = function () {
                    return this.low;
                };
                r.prototype.getLowBitsUnsigned = function () {
                    return this.low >>> 0;
                };
                r.prototype.getNumBitsAbs = function () {
                    if (this.isNegative()) {
                        return this.equals(r.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
                    }
                    var e = 0 != this.high ? this.high : this.low;
                    for (var t = 31; 0 < t && 0 == (e & 1 << t); t--) {
                        ;
                    }
                    return 0 != this.high ? t + 33 : t + 1;
                };
                r.prototype.isZero = function () {
                    return 0 === this.high && 0 === this.low;
                };
                r.prototype.isNegative = function () {
                    return !this.unsigned && this.high < 0;
                };
                r.prototype.isPositive = function () {
                    return this.unsigned || 0 <= this.high;
                };
                r.prototype.isOdd = function () {
                    return 1 == (1 & this.low);
                };
                r.prototype.isEven = function () {
                    return 0 == (1 & this.low);
                };
                r.prototype.equals = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return (this.unsigned === e.unsigned || this.high >>> 31 != 1 || e.high >>> 31 != 1) && this.high === e.high && this.low === e.low;
                };
                r.prototype.notEquals = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return !this.equals(e);
                };
                r.prototype.lessThan = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return this.compare(e) < 0;
                };
                r.prototype.lessThanOrEqual = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return this.compare(e) <= 0;
                };
                r.prototype.greaterThan = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return 0 < this.compare(e);
                };
                r.prototype.greaterThanOrEqual = function (e) {
                    return 0 <= this.compare(e);
                };
                r.prototype.compare = function (e) {
                    if (this.equals(e)) {
                        return 0;
                    }
                    var t = this.isNegative();
                    var n = e.isNegative();
                    return t && !n ? -1 : !t && n ? 1 : this.unsigned ? e.high >>> 0 > this.high >>> 0 || e.high === this.high && e.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.subtract(e).isNegative() ? -1 : 1;
                };
                r.prototype.negate = function () {
                    return !this.unsigned && this.equals(r.MIN_VALUE) ? r.MIN_VALUE : this.not().add(r.ONE);
                };
                r.prototype.add = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    var t = this.high >>> 16;
                    var n = 65535 & this.high;
                    var o = this.low >>> 16;
                    var i = 65535 & this.low;
                    var s = e.high >>> 16;
                    var a = 65535 & e.high;
                    var c = e.low >>> 16;
                    var l = 0;
                    var d = 0;
                    var u = 0;
                    var f = 0;
                    u += (f += i + (65535 & e.low)) >>> 16;
                    d += (u += o + c) >>> 16;
                    l += (d += n + a) >>> 16;
                    l += t + s;
                    return r.fromBits((u &= 65535) << 16 | (f &= 65535), (l &= 65535) << 16 | (d &= 65535), this.unsigned);
                };
                r.prototype.subtract = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return this.add(e.negate());
                };
                r.prototype.multiply = function (e) {
                    if (this.isZero()) {
                        return r.ZERO;
                    }
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    if (e.isZero()) {
                        return r.ZERO;
                    }
                    if (this.equals(r.MIN_VALUE)) {
                        return e.isOdd() ? r.MIN_VALUE : r.ZERO;
                    }
                    if (e.equals(r.MIN_VALUE)) {
                        return this.isOdd() ? r.MIN_VALUE : r.ZERO;
                    }
                    if (this.isNegative()) {
                        return e.isNegative() ? this.negate().multiply(e.negate()) : this.negate().multiply(e).negate();
                    }
                    if (e.isNegative()) {
                        return this.multiply(e.negate()).negate();
                    }
                    if (this.lessThan(d) && e.lessThan(d)) {
                        return r.fromNumber(this.toNumber() * e.toNumber(), this.unsigned);
                    }
                    var t = this.high >>> 16;
                    var n = 65535 & this.high;
                    var o = this.low >>> 16;
                    var i = 65535 & this.low;
                    var s = e.high >>> 16;
                    var a = 65535 & e.high;
                    var c = e.low >>> 16;
                    var l = 65535 & e.low;
                    var u = 0;
                    var f = 0;
                    var h = 0;
                    var w = 0;
                    h += (w += i * l) >>> 16;
                    f += (h += o * l) >>> 16;
                    h &= 65535;
                    f += (h += i * c) >>> 16;
                    u += (f += n * l) >>> 16;
                    f &= 65535;
                    u += (f += o * c) >>> 16;
                    f &= 65535;
                    u += (f += i * a) >>> 16;
                    u += t * l + n * c + o * a + i * s;
                    return r.fromBits((h &= 65535) << 16 | (w &= 65535), (u &= 65535) << 16 | (f &= 65535), this.unsigned);
                };
                r.prototype.div = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    if (e.isZero()) {
                        throw new Error('division by zero');
                    }
                    if (this.isZero()) {
                        return this.unsigned ? r.UZERO : r.ZERO;
                    }
                    var t;
                    var n;
                    var o;
                    if (this.equals(r.MIN_VALUE)) {
                        return e.equals(r.ONE) || e.equals(r.NEG_ONE) ? r.MIN_VALUE : e.equals(r.MIN_VALUE) ? r.ONE : (t = this.shiftRight(1).div(e).shiftLeft(1)).equals(r.ZERO) ? e.isNegative() ? r.ONE : r.NEG_ONE : (n = this.subtract(e.multiply(t)), o = t.add(n.div(e)));
                    }
                    if (e.equals(r.MIN_VALUE)) {
                        return this.unsigned ? r.UZERO : r.ZERO;
                    }
                    if (this.isNegative()) {
                        return e.isNegative() ? this.negate().div(e.negate()) : this.negate().div(e).negate();
                    }
                    if (e.isNegative()) {
                        return this.div(e.negate()).negate();
                    }
                    o = r.ZERO;
                    for (n = this; n.greaterThanOrEqual(e);) {
                        t = Math.max(1, Math.floor(n.toNumber() / e.toNumber()));
                        var i = Math.ceil(Math.log(t) / Math.LN2);
                        var s = i <= 48 ? 1 : Math.pow(2, i - 48);
                        var a = r.fromNumber(t);
                        for (var c = a.multiply(e); c.isNegative() || c.greaterThan(n);) {
                            c = (a = r.fromNumber(t -= s, this.unsigned)).multiply(e);
                        }
                        if (a.isZero()) {
                            a = r.ONE;
                        }
                        o = o.add(a);
                        n = n.subtract(c);
                    }
                    return o;
                };
                r.prototype.modulo = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return this.subtract(this.div(e).multiply(e));
                };
                r.prototype.not = function () {
                    return r.fromBits(~this.low, ~this.high, this.unsigned);
                };
                r.prototype.and = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return r.fromBits(this.low & e.low, this.high & e.high, this.unsigned);
                };
                r.prototype.or = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return r.fromBits(this.low | e.low, this.high | e.high, this.unsigned);
                };
                r.prototype.xor = function (e) {
                    if (!r.isLong(e)) {
                        e = r.fromValue(e);
                    }
                    return r.fromBits(this.low ^ e.low, this.high ^ e.high, this.unsigned);
                };
                r.prototype.shiftLeft = function (e) {
                    if (r.isLong(e)) {
                        e = e.toInt();
                    }
                    return 0 == (e &= 63) ? this : e < 32 ? r.fromBits(this.low << e, this.high << e | this.low >>> 32 - e, this.unsigned) : r.fromBits(0, this.low << e - 32, this.unsigned);
                };
                r.prototype.shiftRight = function (e) {
                    if (r.isLong(e)) {
                        e = e.toInt();
                    }
                    return 0 == (e &= 63) ? this : e < 32 ? r.fromBits(this.low >>> e | this.high << 32 - e, this.high >> e, this.unsigned) : r.fromBits(this.high >> e - 32, 0 <= this.high ? 0 : -1, this.unsigned);
                };
                r.prototype.shiftRightUnsigned = function (e) {
                    if (r.isLong(e)) {
                        e = e.toInt();
                    }
                    if (0 == (e &= 63)) {
                        return this;
                    }
                    var t = this.high;
                    if (e < 32) {
                        var n = this.low;
                        return r.fromBits(n >>> e | t << 32 - e, t >>> e, this.unsigned);
                    }
                    return r.fromBits(32 === e ? t : t >>> e - 32, 0, this.unsigned);
                };
                r.prototype.toSigned = function () {
                    return this.unsigned ? new r(this.low, this.high, false) : this;
                };
                r.prototype.toUnsigned = function () {
                    return this.unsigned ? this : new r(this.low, this.high, true);
                };
                if ('function' == typeof e && 'object' == typeof t && t && 'object' == typeof n && n) {
                    t.exports = r;
                } else {
                    if ('function' == typeof define && define.amd) {
                        define(function () {
                            return r;
                        });
                    } else {
                        (o.dcodeIO = o.dcodeIO || {}).Long = r;
                    }
                }
            }(this);
        },
        {}
    ],
    2: [
        function (e, t, n) {
            t.exports = e('./dist/Long.js');
        },
        { './dist/Long.js': 1 }
    ],
    3: [
        function (e, t, n) {
            window.Long = e('long');
        },
        { long: 2 }
    ]
}, {}, [3]));
chrome.downloads.onCreated.addListener(function (e) {
    var t = e.url;
    if ('text/html' == e.mime) {
        if (t.length > 1000) {
            t = t.substring(0, 1000);
        }
        var n = window.btoa(t);
        var o = document.createElement('a');
        o.href = t;
        var r = o.hostname.toLowerCase();
        if ('DENY' == getRespArr(r = normalizeHostname(r), n, '', t)[0]) {
            chrome.downloads.cancel(e.id);
            return void chrome.downloads.removeFile(e.id);
        }
    }
});
var previousMeetUrl = '';
chrome.runtime.onConnect.addListener(function (e) {
    if ('gmeet' == e.name) {
        e.onMessage.addListener(function (e, t) {
            if (e.url != previousMeetUrl) {
                previousMeetUrl = e.url;
                let n = window.btoa(e.url);
                let o = document.createElement('a');
                o.href = e.url;
                lHostName = o.hostname.toLowerCase();
                lHostName = normalizeHostname(lHostName);
                let i = getRespArrTabs(lHostName, n, '', e.url, t.sender.tab.id, '', false, this);
                let s = i[0];
                let a = i[1];
                if ('DENY' == s) {
                    chrome.tabs.update(t.sender.tab, takeDenyAction(a, 2, n));
                }
            }
        });
    }
});
class FailedOpen {
    constructor(e, t) {
        this.wideOpenMode = 0;
        this.cipaMode = 1;
        this.mode = e;
        this.duration = t;
        if (!(undefined !== this.mode && null != this.mode && -1 != this.mode)) {
            this.mode = 1;
        }
        if (!(undefined !== this.duration && null != this.duration && -1 != this.duration)) {
            this.duration = 300;
        }
        this.timeStamp = Math.floor(Date.now() / 1000);
    }
    isFailedOpen() {
        return Math.floor(Date.now() / 1000) - this.timeStamp < this.duration;
    }
    isWideOpenMode() {
        return this.mode == this.wideOpenMode;
    }
}
const wellPathWidgBg = function () {
    var e = null;
    var t = 0;
    var n = n => {
        var o = new URL(window.clusterUrl).host;
        chrome.cookies.getAll({
            domain: o,
            name: 'wellness_widget_status'
        }, async o => {
            if (o && 0 == o.length) {
                return;
            }
            const r = decodeURIComponent(o[0].value).split(':');
            if (!r.length || 'show' == r[1]) {
                try {
                    const o = {
                        source: 'well-path-widget',
                        action: 'display',
                        data: await (async () => new Promise((n, o) => {
                            if ('notloggedin' == userEmail) {
                                o();
                            }
                            try {
                                var r = new Date().getTime() / 1000;
                                if (r - t <= 5) {
                                    o('response was saved in last 5 seconds');
                                }
                                if (null != e && e.userEmail == userEmail && r - e.timestamp <= 1800) {
                                    return void n(e.content);
                                }
                                var i = window.clusterUrl + '/wellnessPathwaysWidgets?action=getWidget';
                                if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
                                    var s = createNonBlockingRequest('get', i);
                                    s.onerror = function () {
                                        console.error('Error in fetching wellness pathways widget');
                                    };
                                    s.onload = function () {
                                        r;
                                        var t = JSON.parse(s.responseText);
                                        if (t.success && t.widget) {
                                            e = {
                                                userEmail: userEmail,
                                                id: t.widget.id,
                                                content: t.widget.content,
                                                timestamp: new Date().getTime()
                                            };
                                            n(t.widget.content);
                                        } else {
                                            o();
                                        }
                                    };
                                    s.send();
                                } else {
                                    o();
                                }
                            } catch (e) {
                                console.error('Error in fetching widget data', e);
                                o();
                            }
                        }))()
                    };
                    if (undefined !== n && n) {
                        chrome.tabs.sendMessage(n, o);
                    } else {
                        chrome.tabs.query({}, e => {
                            e.forEach((e, t) => {
                                chrome.tabs.sendMessage(e.id, o);
                            });
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });
    };
    chrome.runtime.onMessage.addListener((e, o) => {
        console.debug('wpw msg received', e, o);
        if ('object' == typeof e && undefined !== e.action && undefined !== e.source && undefined !== o.tab.id && -1 != o.tab.id && o.tab.id && 'well-path-widget' == e.source) {
            if ('ready' == e.action) {
                n(o.tab.id);
            }
            if (!('ctaClicked' != e.action && 'closed' != e.action)) {
                (function (e) {
                    try {
                        t = new Date().getTime() / 1000;
                        ;
                        if ('ctaClicked' == e.action) {
                            'close' = e.label;
                            'NULL' = e.link;
                        }
                        var o = window.clusterUrl + '/wellnessPathwaysWidgets';
                        if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
                            var r = createNonBlockingRequest('post', o);
                            r.setRequestHeader('Content-Type', 'application/json');
                            r.onerror = function () {
                                console.error('Error in saving widget response');
                            };
                            r.onload = function () {
                                if (JSON.parse(r.responseText).success) {
                                    console.log('wpw response saved');
                                }
                            };
                            r.send(JSON.stringify(n));
                        }
                    } catch (e) {
                        console.error('Error in saving widget response', e);
                    }
                }(e));
                chrome.tabs.query({}, function (e) {
                    e.forEach(function (e) {
                        chrome.tabs.sendMessage(e.id, {
                            source: 'well-path-widget',
                            action: 'remove'
                        });
                    });
                });
            }
        }
    });
    return { triggerWidgetDisplay: n };
}();
function interceptPostRequest(e) {
    if (window.vectorExpansionRules) {
        var t = Object.keys(window.vectorExpansionRules);
        if (0 != t.length) {
            var n = document.createElement('a');
            n.href = e.initiator;
            mainHost = n.hostname.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
            if (t && -1 != t.indexOf(mainHost)) {
                for (let t = 0; t < window.vectorExpansionRules[mainHost].length; t += 1) {
                    try {
                        let n = window.vectorExpansionRules[mainHost][t].pattern;
                        let r = window.vectorExpansionRules[mainHost][t].context;
                        let i = window.vectorExpansionRules[mainHost][t].field;
                        let s = window.vectorExpansionRules[mainHost][t].content;
                        let a = n.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                        let c = new RegExp(a);
                        let l = '';
                        if (c.test(e.url)) {
                            if ('JSON_STR' == s) {
                                let n = window.vectorExpansionRules[mainHost][t].data.split('|').reduce((e, t) => e[t], e);
                                jsonInfo = JSON.parse(n);
                                if (Array.isArray(i)) {
                                    for (let e = 0; e < i.length; e += 1) {
                                        tempText = null === i[e].split('|').reduce((e, t) => e[t], jsonInfo) || '' === i[e].split('|').reduce((e, t) => e[t], jsonInfo) ? '' : i[e].split('|').reduce((e, t) => e[t], jsonInfo).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                        l = l.length > 0 ? l + ' ' + tempText : tempText;
                                    }
                                } else {
                                    l = null === i.split('|').reduce((e, t) => e[t], jsonInfo) || '' === i.split('|').reduce((e, t) => e[t], jsonInfo) ? '' : i.split('|').reduce((e, t) => e[t], jsonInfo).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                }
                            } else {
                                if ('ENCODED_STR' == s) {
                                    buff = e.requestBody.raw[0].bytes;
                                    postContent = new TextDecoder().decode(buff);
                                    if (Array.isArray(i)) {
                                        for (let e = 0; e < i.length; e += 1) {
                                            tempText = i[e].split('|').reduce((e, t) => new URLSearchParams(e).get(t), postContent);
                                            l = l.length > 0 ? l + ' ' + tempText : tempText;
                                        }
                                    } else {
                                        l = i.split('|').reduce((e, t) => new URLSearchParams(e).get(t), postContent);
                                    }
                                    l = 'reddit.com' == mainHost ? null === fetchStringFromJSONObj(JSON.parse(l), 't') || '' === fetchStringFromJSONObj(JSON.parse(l), 't') ? '' : fetchStringFromJSONObj(JSON.parse(l), 't').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ') : null === l || '' === l ? '' : l.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                } else {
                                    if ('ENCODED' == s) {
                                        buff = e.requestBody.raw[0].bytes;
                                        s = new TextDecoder().decode(buff);
                                        let t = JSON.parse(s);
                                        if (Array.isArray(i)) {
                                            for (let e = 0; e < i.length; e += 1) {
                                                if ('tumblr.com' == mainHost && 'content' == i[e]) {
                                                    tempText = null === fetchStringFromJSONObj(t, 'text') || '' === fetchStringFromJSONObj(t, 'text') ? '' : fetchStringFromJSONObj(t, 'text').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                } else {
                                                    tempText = null === i[e].split('|').reduce((e, t) => e[t], t) || '' === i[e].split('|').reduce((e, t) => e[t], t) ? '' : i[e].split('|').reduce((e, t) => e[t], t).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                }
                                                l = l.length > 0 ? l + ' ' + tempText : tempText;
                                            }
                                        } else {
                                            l = null === i.split('|').reduce((e, t) => e[t], t) || '' === i.split('|').reduce((e, t) => e[t], t) ? '' : i.split('|').reduce((e, t) => e[t], t).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                        }
                                    } else {
                                        if ('DOUBLE_ENCODED' == s) {
                                            buff = e.requestBody.raw[0].bytes;
                                            s = new TextDecoder().decode(buff);
                                            let t = JSON.parse(s);
                                            let n = i.split('||');
                                            if ('quora.com' == mainHost && (t && t.queryName && -1 != t.queryName.indexOf('answerCreate') && (r = 'ANSWER'), t && t.queryName && -1 != t.queryName.toLowerCase().indexOf('draft'))) {
                                                continue;
                                            }
                                            if (n.length > 0) {
                                                var o = n[0].split('|').reduce((e, t) => e[t], t);
                                                l = null === (l = fetchStringFromJSONObj(JSON.parse(o), 'text')) || '' === (l = fetchStringFromJSONObj(JSON.parse(o), 'text')) ? '' : (l = fetchStringFromJSONObj(JSON.parse(o), 'text')).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                            }
                                        } else {
                                            if ('QUERY_PARAM' == s) {
                                                l = new Proxy(new URLSearchParams(e.url), { get: (e, t) => e.get(t) })[i];
                                            } else {
                                                if (Array.isArray(i)) {
                                                    for (let t = 0; t < i.length; t += 1) {
                                                        tempText = null === i[t].split('|').reduce((e, t) => {
                                                            try {
                                                                return -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]];
                                                            } catch (e) {
                                                                return '';
                                                            }
                                                        }, e) || '' === i[t].split('|').reduce((e, t) => {
                                                            try {
                                                                return -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]];
                                                            } catch (e) {
                                                                return '';
                                                            }
                                                        }, e) ? '' : i[t].split('|').reduce((e, t) => {
                                                            try {
                                                                return -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]];
                                                            } catch (e) {
                                                                return '';
                                                            }
                                                        }, e).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                        if ('reddit.com' == mainHost && -1 != i[t].indexOf('richtext_json') && tempText.length > 0) {
                                                            textStr = null === fetchStringFromJSONObj(JSON.parse(tempText), 't') || '' === fetchStringFromJSONObj(JSON.parse(tempText), 't') ? '' : fetchStringFromJSONObj(JSON.parse(tempText), 't').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                            captionStr = null === fetchStringFromJSONObj(JSON.parse(tempText), 'c') || '' === fetchStringFromJSONObj(JSON.parse(tempText), 'c') ? '' : fetchStringFromJSONObj(JSON.parse(tempText), 'c').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                            tempText = textStr + ' ' + captionStr;
                                                        }
                                                        l = l.length > 0 ? l + ' ' + tempText : tempText;
                                                    }
                                                } else {
                                                    l = null === i.split('|').reduce((e, t) => -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]], e) || '' === i.split('|').reduce((e, t) => -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]], e) ? '' : i.split('|').reduce((e, t) => -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]], e).replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (l && -1 != l.trim().indexOf(' ')) {
                                sendSocialPostToServer(l, mainHost, r, e.url);
                            }
                        }
                    } catch (e) {
                    }
                }
            }
        }
    }
}
function fetchStringFromJSONObj(e, t) {
    let n = '';
    for (let o in e)
        if ('object' == typeof e[o]) {
            n = n + ' ' + fetchStringFromJSONObj(e[o], t).trim();
        } else {
            if (o == t) {
                n = n + ' ' + e[o];
            }
        }
    return n.trim();
}
window.userStatus = {
    NOTFOUND: -1,
    FOUND: 1
};
window.clusterStatus = {
    ERROR: -2,
    NOTFOUND: -1,
    FOUND: 1,
    AVOID_OS: 2,
    UNKNOWN_SCHOOL: 3
};
window.version = '-';
window.userFound = window.userStatus.NOTFOUND;
window.clusterFound = window.clusterStatus.NOTFOUND;
window.userEmail = 'notloggedin';
window.clusterUrl = 'unknown';
window.ytpref = 'prefnotchecked';
window.ytprefnewvalue = 'notset';
window.hideComments = false;
window.hideRecommended = false;
window.hideThumbnails = false;
window.hideSidebar = false;
window.ytOptionsLastCheck = null;
window.youtubeFrames = [];
window.checkYouTube = true;
window.refDomain = '';
window.lastMapsUrl = '';
window.geolocation = false;
window.geoLat = null;
window.geoLng = null;
window.geoIntervalId = null;
window.needToReloadTabs = 1;
window.isBlockedYTVideo = false;
window.debugIWF = 0;
window.IWFTimeout = 1209600000;
window.isSubFrame = false;
window.checkiFrames = 0;
window.failedOpenObj = null;
window.twitterMessageURI = '/statuses/update.json';
window.twitterPrefetchTimestamp = 'prefetchtimestamp';
window.tabsBeingBlocked = {};
window.brokredRequest = [];
window.brokeredArrIndex = 0;
window.lastBrokeredRequest = '';
window.fid = null;
window.latencyFrequency = 600000;
window.latencyAPI = null;
window.latencyInterval = null;
window.defaultConfigTTL = window.currentConfigTTL = 3600000;
window.skipList = [];
window.selfharmlist = [];
window.bullyPhrases = [];
window.wlBullyPhrases = [];
window.thinkTwicePassPhrase = 'Th!nkTw!ce';
window.featureConfig = {};
var phraseMatchList = {
    Bully: [],
    Grief: [],
    Violence: []
};
getVersion();
getGeolocationStatus();
setInterval(function () {
    getGeolocationStatus();
    getFeatureConfig();
    window.brokredRequest = [];
}, 3600000);
setInterval(clearBlob, 3000);
setupListener();
fetchUserAPI();
setupIWF();
downloadConfig();
updateTTLForCrextnCacheConfig(window.defaultConfigTTL);
getFeatureConfig();
