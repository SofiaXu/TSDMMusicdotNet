SF_JS_INCLUDED["package/package.js"] = true;
if (!SF_JS_INCLUDED["top/hensei.js"]) document.write('<script type="text/javascript" src="http://cf.mora.jp/cfdocs/addition/js/top/hensei.js"></script>');
document.write('<script type="text/javascript" src="http://cf.mora.jp/cfdocs/addition/js/buy/amazonOneClickBuy.js"></script>');
var unAuthorized_labelId = new Array();
unAuthorized_labelId[0] = "00000058";
$(document).ready(function () {
    new SFCommunicator({
        preloadImg: "http://cf.mora.jp/cfdocs/addition/img/preload_s.gif",
        url: SFPath.getPackage(mountPoint, labelId, materialNo) + "/packageMeta.json",
        elements: "#wrapperInner",
        success: Package.receivePackageData,
        error: function () {
            location.href = sfUrl["notFound"]
        },
        async: false
    }).go();
    new SFAccordionDisplay($("#artist_profile"), {
        contents: '<p id="artist_comment"></p>',
        contentsHeight: "70px"
    }).init();
    new SFCommunicator({
        preloadImg: "http://cf.mora.jp/cfdocs/addition/img/preload_s.gif",
        url: sfUrl["artistInfo"] + "/" + artistNo,
        elements: "#artist_profile",
        success: Package.renderArtistInfo,
        error: Package.renderArtistInfoError
    }).go();
    if (!isPC) {
        $("body").css("user-select", "none").css("-webkit-user-select", "none").css("-moz-user-select", "none").css("-khtml-user-select", "none").css("-webkit-user-drag", "none").css("-khtml-user-drag", "none").css("-webkit-touch-callout", "none");
        $("body").bind("copy",
            function () {
                return false
            });
        $("body").bind("cut",
            function () {
                return false
            });
        $("body").bind("selectstart",
            function () {
                return false
            });
        $("body").bind("contextmenu",
            function () {
                return false
            })
    }
});
var confirmOnlyCoupon = function (selector) {
    var header = '<p class="headerText">ご案内</p>';
    var contents = '<p class="line1">ただ今、こちらの商品は対象のミュージッククーポンをお持ちの方のみダウンロードが可能です。</p>' + '<p class="line2">クーポンを使用して商品をダウンロードしますか？</p>' + '<p class="line3">※対象のクーポンをお持ちでまだ登録前の方は、クーポンBOXよりご登録をお願いします。</p>' + '<a class="confirmYes" href="#">はい</a><a class="confirmNo" href="#">キャンセル</a>';
    new SFDialog(selector, {
        header: header,
        contents: contents,
        confirmYes: function () {
            location.href = sfUrl['coupon']
        }
    })
};
var Package = {
    sfPackageData: null,
    renderMain: function () {
        json = Package.sfPackageData;
        if (json["callCoupon"] == "1") {
            $("#snsBtn_area").css("visibility", "hidden")
        }
        $("#package_title").text(json["title"]);
        $("#package_image img").attr("src", json["packageUrl"] + json["fullsizeimage"]);
        $("#package_image img").attr("alt", SFCommon.getAlt(json["title"], json["artistName"]));
        var titleTag = document.title;
        titleTag = SFCommon.getAlt(json["title"], json["artistName"]) + "｜" + titleTag;
        document.title = titleTag;
        var description = json["catchcopy"];
        if (!description) {
            description = json["packageComment"]
        }
        if (!description) {
            description = json["tie"]
        }
        if (description) {
            $("meta[name='description']").attr("content", description.substring(0, 128));
            $('meta[property="og:description"]').attr('content', description.substring(0, 128))
        } else {
            description = $("meta[name='description']").attr("content");
            $("meta[name='description']").attr("content", SFCommon.getAlt(json["title"], json["artistName"]) + " | " + description);
            $('meta[property="og:description"]').attr('content', SFCommon.getAlt(json["title"], json["artistName"]) + " | " + description)
        }
        var metaKeywords = $("meta[name='keywords']").attr("content");
        metaKeywords = SFCommon.getMetaKeywords(json["title"], json["artistName"], json["titleKana"], json["artistNameKana"]) + metaKeywords;
        $("meta[name='keywords']").attr("content", metaKeywords);
        var artistPageUrl = sfUrl["artist"] + "/" + json["artistNo"] + "/";
        $("#package_banner4 a").attr("href", artistPageUrl);
        $("#package_artist a").attr("href", artistPageUrl);
        $("#package_artist a").text(json["artistName"]);
        if (json["callCoupon"] == "1") {
            $("#package_banner4").hide(0);
            $("#package_artist a").attr("href", "javascript:void(0);").attr("hideFocus", "true");
            $("#package_artist a").css("cursor", "text").css("text-decoration", "none").css("outline", "none")
        }
        $("#package_artist").css("word-break", "break-all");
        $("#package_label").text((json["labelcompanyname"]) ? json["labelcompanyname"] : "-");
        var dispStartDate = Package.convertDateFormat(json["dispStartDate"]);
        $("#package_release").text(dispStartDate);
        $("#package_number").text("全" + json["trackList"].length + "曲");
        $("#package_id").text(json["materialNo"]);
        if (json["bannerLinkUrl0"] == null) {
            $("#package_banner0").css("display", "none")
        } else {
            $("#package_banner0 > a").attr("href", json["bannerLinkUrl0"]);
            if (json["bannerTargetBlank0"] == "1") {
                $("#package_banner0 > a").attr("target", "_blank")
            }
            if (json["bannerimage0"]) {
                $("#package_banner0 > a > img").css("display", "none");
                $("#package_banner0 > a").addClass("package_banner0_linkArea")
            }
        }
        if (json["bannerLinkUrl1"] == null) {
            $("#package_banner1").css("display", "none")
        } else {
            $("#package_banner1 > a").attr("href", json["bannerLinkUrl1"]);
            if (json["bannerTargetBlank1"] == "1") {
                $("#package_banner1 > a").attr("target", "_blank")
            }
            $("#package_banner1 > a > img").attr("src", json["packageUrl"] + json["bannerimage1"])
        }
        if (json["bannerLinkUrl2"] == null) {
            $("#package_banner2").css("display", "none")
        } else {
            $("#package_banner2 > a").attr("href", json["bannerLinkUrl2"]);
            if (json["bannerTargetBlank2"] == "1") {
                $("#package_banner2 > a").attr("target", "_blank")
            }
            $("#package_banner2 > a > img").attr("src", json["packageUrl"] + json["bannerimage2"])
        }
        if (json["bannerLinkUrl3"] == null) {
            $("#package_banner3").css("display", "none")
        } else {
            $("#package_banner3 > a").attr("href", json["bannerLinkUrl3"]);
            if (json["bannerTargetBlank3"] == "1") {
                $("#package_banner3 > a").attr("target", "_blank")
            }
            $("#package_banner3 > a > img").attr("src", json["packageUrl"] + json["bannerimage3"])
        }
        var packageComment = (json["packageComment"] != null && json["packageComment"].length > 0) ? json["packageComment"] + "<br/>" : "";
        var tie = (json["tie"] != null && json["tie"].length > 0) ? "【タイアップ】<br/>" + json["tie"] + "<br/>" : "";
        var textAreaBottomOfBanner = packageComment + ((packageComment.length > 0) ? "<br/>" : "") + tie;
        if (textAreaBottomOfBanner != "") {
            textAreaBottomOfBanner += "<br /><br />";
            $(".package_descInner").prepend(textAreaBottomOfBanner.replace(/\n/g, "<br/>"))
        } else {
            $("#package_description").css("display", "none")
        }
        var matomeUri = (json["distFlg"] == 0 && ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(json["startDate"])), $.dateWithString(json["endDate"])) == 0) && json["price"] != null);
        if (matomeUri) {
            var onclick = SFCart.getCartParam({
                materialNo: json["materialNo"],
                mediaFlg: json["mediaFlg"],
                packageUrl: json["packageUrl"],
                artistName: json["artistName"]
            },
                "all");
            var onclickStay = SFCart.getCartParam({
                materialNo: json["materialNo"],
                mediaFlg: json["mediaFlg"],
                packageUrl: json["packageUrl"],
                artistName: json["artistName"]
            },
                "all", "", false, true);
            var html = null;
            if (json["couponProduct"] == "1") {
                if (isPC || isMoraAppForTablet || isIOS || isAndroid) {
                    html = '<!--まとめて購入ボタン--><a href="#" class="package_btnBuyAll btn_cart matometeCoupon">まとめて購入 クーポンのみ</a><!--//まとめて購入ボタン-->'
                } else {
                    html = '<!--まとめて購入ボタン--><a href="#" class="package_btnBuyAll btn_cart" ' + onclick + '>まとめて購入 クーポンのみ</a><!--//まとめて購入ボタン-->'
                }
            } else {
                if (amazonOneClickMode) {
                    var purchaseParam = "{" + "'materialNo':'" + json["materialNo"] + "'" + ", 'price':'" + json["price"] + "'" + ", 'title':'" + escapeQuotes(json["title"]) + "'" + ", 'mediaFlg':'" + json["mediaFlg"] + "'" + ", 'artistName':'" + json["artistName"] + "'" + ", 'catalystType':'all'" + "}";
                    html = this.renderMatomeOneClickBtn(onclick, onclickStay, purchaseParam, $.formatPrice(json["price"]))
                } else {
                    html = this.renderMatomePurchaseBtn(onclick, onclickStay, $.formatPrice(json["price"]))
                }
            }
            $(".package_btnBuyAll").replaceWith(html);
            confirmOnlyCoupon(".matometeCoupon")
        } else {
            $(".package_btnBuyAll").css("display", "none");
            $("#package_price_title").css("display", "none");
            $("#package_price").css("display", "none")
        }
        if (!amazonOneClickMode) {
            $("#oneClickEnableMessage").css("display", "none")
        }
        var twitter_txt = json["artistName"] + '／' + json["title"];
        if (twitter_txt.length > 109) {
            twitter_txt = twitter_txt.substr(0, 107);
            twitter_txt += '…'
        }
        $("#snsBtn_tw").html('<a href="https://twitter.com/intent/tweet?url=' + encodeURI(location.href) + '&amp;text=' + encodeURIComponent(twitter_txt) + '&amp;hashtags=morajp" target="_blank" title="Tweet(ツイート)"><img src="/pc/img/btn_tweet.png" width="72" height="18" alt="Tweet(ツイート)"></a>');
        $("#snsBtn_fb").html('<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI(location.href) + '&amp;width&amp;layout=button&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;" allowtransparency="true"></iframe>');
        $('meta[property="og:title"]').attr('content', titleTag);
        $('meta[property="og:url"]').attr('content', location.href);
        $('meta[property="og:image"]').attr('content', json["packageUrl"] + json["fullsizeimage"]);
        if (isPC || isMoraAppForTablet || isTablet || isWindowsPhone) {
            $(".package_btnPurchase").click(function () {
                if (!isIOS && !isAndroid && isTablet && !isMoraAppForTablet || isWindowsPhone) {
                    SFMobile.intentPackage(json["packageUrl"], json["materialNo"])
                } else {
                    var params = [];
                    var paramIndex = 0;
                    $(".purchaseChk").each(function () {
                        if ($(this).attr("checked")) {
                            var value = $(this).val().split(",");
                            params[paramIndex++] = {
                                materialNo: value[0],
                                mediaFlg: value[2],
                                artistName: value[4]
                            }
                        }
                    });
                    if (json["trackList"].length == params.length && matomeUri) {
                        SFCart.addCart([{
                            materialNo: json["materialNo"],
                            mediaFlg: json["mediaFlg"],
                            artistName: json["artistName"]
                        }], "all")
                    } else {
                        SFCart.addCart(params, "each");
                    }
                }
                return false
            });
            Package.makeTrackList(json)
        } else {
            Package.makeTrackListForMobile(json);
            $(".package_btnApp1, .package_btnApp2").click(function () {
                SFMobile.intentPackage(json["packageUrl"], json["materialNo"]);
                return false
            })
        }
        if (json["relatedPackage"].length > 0) {
            for (var i = 0; i < json["relatedPackage"].length; i++) {
                var relatedPackageMediaFormatNo = json["relatedPackage"][i]["mediaFormatNo"];
                var relatedPackageMedia = "";
                if (relatedPackageMediaFormatNo == "10") {
                    relatedPackageMedia = "music"
                } else if (relatedPackageMediaFormatNo == "11") {
                    relatedPackageMedia = "video"
                } else if (relatedPackageMediaFormatNo == "12" || relatedPackageMediaFormatNo == "13") {
                    relatedPackageMedia = "highreso"
                }
                var relativeHTML = '<article class="package_relativeWrap ' + relatedPackageMedia + '" id="package_relative_item' + (i + 1) + '" style="word-break: break-all;">' + '<!--リンク--><a href="' + json["relatedPackage"][i]["packagePageUrl"] + '" class="linkArea"><div class="package_relativeName">' + '<!--アーティスト名-->' + $.escapeHTML(json["relatedPackage"][i]["title"]) + '<!--//アーティスト名--></div></a><!--//リンク-->' + '</article>';
                $("#package_relative > div[class=package_relative]").append(relativeHTML)
            }
        } else {
            $("#package_relative").css("display", "none")
        }
        var musicType = "邦楽";
        var genreTopUrl = sfUrl["index_j"];
        if (json["musicType"] == "1") {
            musicType = "洋楽";
            genreTopUrl = sfUrl["index_i"]
        } else if (json["musicType"] == "2") {
            musicType = "バラエティ";
            genreTopUrl = sfUrl["index_v"]
        }
        $("#pannaviMusicType > a").text(musicType);
        $("#pannaviMusicType > a").attr("href", genreTopUrl);
        $("#pannaviArtistName > a").text(json["artistName"]);
        $("#pannaviArtistName > a").attr("href", artistPageUrl);
        if (json["callCoupon"] == "1") {
            $("#pannaviArtistName > a").attr("href", "javascript:void(0);").attr("hideFocus", "true");
            $("#pannaviArtistName > a").css("cursor", "text").css("outline", "none")
        }
        $("#pannaviTitle").text(json["title"]);
        $(window).resize(function () {
            if (isMobile) {
                $(".package_infoDataM > div").each(function (index) {
                    $(".package_infoDataL > div:eq(" + index + ")").height($(this).height())
                })
            }
        });
        $(".select-all-items").attr("checked", false); (function () {
            var checked = false;
            var checkboxes = $("input[type='checkbox']");
            var button = $(".select-all-items");
            button.bind("mouseup",
                function () {
                    if (checked) {
                        checkboxes.removeAttr("checked");
                        button.removeClass("on")
                    } else {
                        checkboxes.attr({
                            checked: "checked"
                        });
                        button.addClass("on")
                    }
                    checked = !checked;
                    return false
                }).bind("click",
                function () {
                    return false
                })
        })()
    },
    makeTrackList: function (json) {
        var trackList = json["trackList"];
        var packageUrl = json["packageUrl"];
        var mediaFormatNo = json["mediaFormatNo"];
        var productTypeNo = json["productTypeNo"];
        var mediaType = json["mediaType"];
        var bitPerSample = json["bitPerSample"];
        var samplingFreq = json["samplingFreq"];
        var trackMaterialNo = new SFRequest().getParam("trackMaterialNo");
        var allSize = 0;
        var allDuration = 0;
        for (var i = 0; i < trackList.length; i++) {
            if (i == 0 && productTypeNo == "0") {
                productTypeNo = trackList[i]["productTypeNo"]
            }
            var isAddCart = true;
            if (trackList[i]["distFlg"] == 1 || ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(trackList[i]["startDate"])), $.dateWithString(trackList[i]["endDate"])) != 0)) {
                isAddCart = false
            }
            html = '<tr class="package_tr' + ((i % 2 == 0) ? '1' : '2') + ((trackMaterialNo && trackList[i]["materialNo"] == trackMaterialNo) ? ' selected_package_tr' : '') + '" id="package_list_item' + (i + 1) + '">';
            html += '<td class="package_td1"><!--No-->' + trackList[i]["trackNo"] + '<!--//No--></td>';
            html += '<td class="package_td2_0">';
            var onclickAudition = "";
            var listenStyle = ' style="cursor: default;" ';
            var unavailableListen = "";
            var video_switcher = "";
            if (trackList[i]["listenFlg"] == "1") {
                onclickAudition = SFAudition.getAuditionParam(trackList[i], packageUrl);
                video_switcher = ' onclick="video_player_switcher(' + trackList[i]["materialNo"] + '); return false;"';
                listenStyle = ""
            } else {
                unavailableListen = 'style="background-image: none;"'
            }
            html += '<div class="package_btnPlay"' + onclickAudition + ' ' + unavailableListen + ' ><!--試聴ボタン--><a href="javascript:void(0);" ' + listenStyle + ' hidefocus="true"></a><!--//試聴ボタン--></div>';
            html += '</td>';
            var title = $.insertWBRTag(trackList[i]["title"], true);
            var artistName = $.insertWBRTag(trackList[i]["artistName"], true);
            var albumTitle = $.insertWBRTag(json["title"], true);
            var showLyrics = "0";
            if (lyricsDispFlg == "1" && trackList[i]["tid"] != null) {
                showLyrics = "1"
            }
            if (showLyrics == "1") {
                var trackInfo = {
                    "materialNo": trackList[i]["materialNo"]
                };
                html += '<td class="package_td2_0">' + '<a class="lyricsBtn" href="#" hidefocus="true">' + '<input type="hidden" name="trackInfo" value="' + $.escapeHTML($.stringify(trackInfo)) + '" />' + '</a>' + '</td>'
            } else {
                html += '<td class="package_td2_0" style="text-align: center;"><!--歌詞ボタン--><span id="lyricsButton_' + i + '">-</span><!--//歌詞ボタン--></td>'
            }
            var trackBitPerSample = trackList[i]["bitPerSample"];
            var trackSamplingFreq = trackList[i]["samplingFreq"];
            var khz = (Math.floor((trackSamplingFreq / 1000) * 10) / 10).toFixed(1);
            var mhz = (Math.floor((trackSamplingFreq / 1000000) * 10) / 10).toFixed(1);
            var tMediaFormatNo = trackList[i]["mediaFormatNo"];
            var spec = "";
            if (tMediaFormatNo == 10) {
                spec = "AAC-LC 320kbps"
            } else if (tMediaFormatNo == 11) {
                spec = ($.inArray(json['packageId'], hdPackages) != -1) ? "HD｜AVC/H.264" : "SD｜AVC/H.264"
            } else if (tMediaFormatNo == 12) {
                spec = khz + 'kHz/' + trackBitPerSample + 'bit'
            } else if (tMediaFormatNo == 13) {
                spec = mhz + 'MHz/' + trackBitPerSample + 'bit'
            }
            var trackSize = $.calcFileSize(tMediaFormatNo, trackList[i]["duration"], trackBitPerSample, trackList[i]["channelConf"], trackSamplingFreq);
            allSize += trackSize;
            allDuration += trackList[i]["duration"];
            html += '<td class="package_td2 package_td2_2"><!--商品カテゴリ--><div class="' + Package.getTrackIcon(trackList[i]["mediaFormatNo"], trackList[i]["mediaFlg"]) + '"></div>';
            html += '<div class="package_title2" style="word-break: break-all;"><!--楽曲名-->' + title + '<!--//楽曲名--></div></td>';
            html += '<td class="package_td8" align="center"><!--スペック-->' + spec + '<!--//スペック--></td>';
            html += '<td class="package_td3" style="word-break: break-all;"><!--アーティスト名-->' + artistName + '<!--//アーティスト名--></td>';
            html += '<td class="package_td4"><!--時間-->' + $.convertTimeWithSec(trackList[i]["duration"]) + '<!--//時間-->';
            html += '</br><!--サイズ-->' + $.formatFileSize(trackSize) + '<!--//サイズ--></td>';
            if (isAddCart) {
                if (trackList[i]["couponProduct"] == "1") {
                    html += '<td class="package_td7"><!--購入ボタン--><a href="#" title="買い物カゴに入れる" class="package_btnPrice btn_cart btn_onlyCoupon">クーポンのみ</a><!--//購入ボタン--></td>'
                } else {
                    var onclickCart = SFCart.getCartParam(trackList[i], "one", packageUrl);
                    var onclickCartStay = SFCart.getCartParam(trackList[i], "one", packageUrl, false, true);
                    if (amazonOneClickMode) {
                        var purchaseParam = "{" + "'materialNo':'" + trackList[i]["materialNo"] + "'" + ", 'price':'" + trackList[i]["price"] + "'" + ", 'title':'" + escapeQuotes(trackList[i]["title"]) + "'" + ", 'mediaFlg':'" + json["mediaFlg"] + "'" + ", 'artistName':'" + json["artistName"] + "'" + ", 'catalystType':'one'" + "}";
                        html += this.renderOneClickBtn(onclickCart, onclickCartStay, purchaseParam, ((Package.isViewPrice(nowDate, trackList[i])) ? "&yen; " + $.formatPrice(trackList[i]["price"]) : ""))
                    } else {
                        html += this.renderPurchaseBtn(onclickCart, onclickCartStay, ((Package.isViewPrice(nowDate, trackList[i])) ? "&yen; " + $.formatPrice(trackList[i]["price"]) : ""))
                    }
                }
            } else if ($.compareDate(nowDate, $.dateWithString(trackList[i]["startDate"]), $.dateWithString(trackList[i]["endDate"])) == -1) {
                html += '<td class="package_td7" style="background: url(../../../pc/img/package/icon_soon_square.png) no-repeat center;"></td>'
            } else {
                html += '<td class="package_td7"><span class="only_album">アルバムのみ</span></td>'
            }
            html += '</tr>';
            $("#package_list > table > tbody").append(html)
        }
        $("#package_time").text($.convertTimeWithSec(allDuration));
        var matomeUri = (json["distFlg"] == 0 && ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(json["startDate"])), $.dateWithString(json["endDate"])) == 0) && json["price"] != null);
        if (matomeUri) {
            $("#package_size").text($.formatFileSize(allSize))
        } else {
            $("#package_size_text").css("display", "none");
            $("#package_size").css("display", "none")
        }
        Package.bindLyricsBtn({
            isTableLayout: true,
            useTrackTopAnimation: false
        });
        confirmOnlyCoupon(".btn_onlyCoupon");
        if (isPC) {
            Audition.loadScreen()
        }
        Package.setPackageData(json, mediaFormatNo, productTypeNo, bitPerSample, samplingFreq, mediaType)
    },
    makeTrackListForMobile: function (json) {
        var trackList = json["trackList"];
        var packageUrl = json["packageUrl"];
        var mediaFormatNo = json["mediaFormatNo"];
        var productTypeNo = json["productTypeNo"];
        var mediaType = json["mediaType"];
        var bitPerSample = json["bitPerSample"];
        var samplingFreq = json["samplingFreq"];
        var trackMaterialNo = new SFRequest().getParam("trackMaterialNo");
        var allSize = 0;
        var allDuration = 0;
        for (var i = 0; i < trackList.length; i++) {
            if (i == 0 && productTypeNo == "0") {
                productTypeNo = trackList[i]["productTypeNo"]
            }
            var isAddCart = true;
            if (trackList[i]["distFlg"] == 1 || ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(trackList[i]["startDate"])), $.dateWithString(trackList[i]["endDate"])) != 0)) {
                isAddCart = false
            }
            html = '<article class="package_listWrapper package_listBG' + ((i % 2 == 0) ? '1' : '2') + ((trackMaterialNo && trackList[i]["materialNo"] == trackMaterialNo) ? ' selected_package_tr' : '') + '">' + '<div class="package_listInner">';
            var title = $.insertWBRTag(trackList[i]["title"], true);
            var artistName = $.insertWBRTag(trackList[i]["artistName"], true);
            var trackBitPerSample = trackList[i]["bitPerSample"];
            var trackSamplingFreq = trackList[i]["samplingFreq"];
            var khz = (Math.floor((trackSamplingFreq / 1000) * 10) / 10).toFixed(1);
            var mhz = (Math.floor((trackSamplingFreq / 1000000) * 10) / 10).toFixed(1);
            var tMediaFormatNo = trackList[i]["mediaFormatNo"];
            var spec = "";
            if (tMediaFormatNo == 10) {
                spec = "AAC-LC 320kbps"
            } else if (tMediaFormatNo == 11) {
                spec = ($.inArray(json['packageId'], hdPackages) != -1) ? "HD｜AVC/H.264" : "SD｜AVC/H.264"
            } else if (tMediaFormatNo == 12) {
                spec = khz + 'kHz/' + trackBitPerSample + 'bit'
            } else if (tMediaFormatNo == 13) {
                spec = mhz + 'MHz/' + trackBitPerSample + 'bit'
            }
            var trackSize = $.calcFileSize(tMediaFormatNo, trackList[i]["duration"], trackBitPerSample, trackList[i]["channelConf"], trackSamplingFreq);
            allSize += trackSize;
            allDuration += trackList[i]["duration"];
            html += '<!--リンク--><a href="javascript:void(0);" class="linkArea"><div class="package_listNo"><!--No-->' + trackList[i]["trackNo"] + '<!--//No--></div>' + '<div class="package_listTitle2" style="word-break: break-all;"><!--楽曲名-->' + title + '<!--//楽曲名--></div>' + '<div class="package_listArtist" style="word-break: break-all;"><!--アーティスト名-->' + artistName + '<!--//アーティスト名--></div>' + '<div class="package_listFormat" style="word-break: break-all;"><!--スペック-->' + spec + '<!--//スペック--></div>' + '<div class="package_listTime"><!--時間-->' + $.convertTimeWithSec(trackList[i]["duration"]) + '<!--//時間--></div>' + '<div class="package_listTime"><!--サイズ-->' + $.formatFileSize(trackSize) + '<!--//サイズ--></div>' + '<div class="package_listEnd"></div></a><!--//リンク-->';
            var onclickAudition = "";
            var unavailableListen = "";
            var video_switcher = "";
            if (trackList[i]["listenFlg"] == "1") {
                onclickAudition = SFAudition.getAuditionParam(trackList[i], packageUrl)
            } else {
                unavailableListen = 'style="background-image: none;"'
            }
            html += '<!--試聴ボタン--><a href="javascript:void(0);" class="package_listPlay" ' + onclickAudition + ' ' + unavailableListen + '></a><!--//試聴ボタン-->';
            var showLyrics = "0";
            if (lyricsDispFlg == "1" && trackList[i]["tid"] != null) {
                showLyrics = "1"
            }
            if (showLyrics == "1") {
                var trackInfo = {
                    "materialNo": trackList[i]["materialNo"]
                };
                html += '<div><a class="lyricsBtn" href="#">' + '<input type="hidden" name="trackInfo" value="' + $.escapeHTML($.stringify(trackInfo)) + '" />' + '</a></div>'
            }
            if (isAddCart) {
                var onclickCart = SFCart.getCartParam(trackList[i], "one", packageUrl);
                var onclickCartStay = SFCart.getCartParam(trackList[i], "one", packageUrl, false, true);
                if (trackList[i]["couponProduct"] == "1") {
                    if (isMoraAppForTablet || isIOS || isAndroid) {
                        html += '<!--購入ボタン--><a title="買い物カゴに入れる" class="package_listPriceBtn btn_onlyCoupon">クーポンのみ</a><!--//購入ボタン-->'
                    } else {
                        html += '<!--購入ボタン--><a title="買い物カゴに入れる" class="package_listPriceBtn" ' + onclickCart + '>クーポンのみ</a><!--//購入ボタン-->'
                    }
                } else {
                    if (amazonOneClickMode) {
                        var purchaseParam = "{" + "'materialNo':'" + trackList[i]["materialNo"] + "'" + ", 'price':'" + trackList[i]["price"] + "'" + ", 'title':'" + escapeQuotes(trackList[i]["title"]) + "'" + ", 'mediaFlg':'" + json["mediaFlg"] + "'" + ", 'artistName':'" + json["artistName"] + "'" + ", 'catalystType':'one'" + "}";
                        html += this.renderMobileOneClickBtn(onclickCart, onclickCartStay, purchaseParam, ((Package.isViewPrice(nowDate, trackList[i])) ? "&yen; " + $.formatPrice(trackList[i]["price"]) : ""))
                    } else {
                        html += this.renderMobilePurchaseBtn(onclickCart, onclickCartStay, ((Package.isViewPrice(nowDate, trackList[i])) ? "&yen; " + $.formatPrice(trackList[i]["price"]) : ""))
                    }
                }
            } else if ($.compareDate(nowDate, $.dateWithString(trackList[i]["startDate"]), $.dateWithString(trackList[i]["endDate"])) == -1) {
                html += '<p class="package_listUnreleased"></p>'
            } else {
                html += '<p class="only_album">アルバムのみ</p>'
            }
            html += '<!--商品カテゴリ--><div class="' + Package.getTrackIcon(trackList[i]["mediaFormatNo"], trackList[i]["mediaFlg"]) + '"></div><!--//商品カテゴリ-->';
            html += '</div>';
            html += '</article>';
            $("#package_list_mb").before(html)
        }
        $("#package_time").text($.convertTimeWithSec(allDuration));
        var matomeUri = (json["distFlg"] == 0 && ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(json["startDate"])), $.dateWithString(json["endDate"])) == 0) && json["price"] != null);
        if (matomeUri) {
            $("#package_size").text($.formatFileSize(allSize))
        } else {
            $("#package_size_text").css("display", "none");
            $("#package_size").css("display", "none")
        }
        Package.bindLyricsBtn({
            isTableLayout: false,
            useTrackTopAnimation: true
        });
        confirmOnlyCoupon(".btn_onlyCoupon");
        Package.setPackageData(json, mediaFormatNo, productTypeNo, bitPerSample, samplingFreq, mediaType)
    },
    setPackageData: function (json, mediaFormatNo, productTypeNo, bitPerSample, samplingFreq, mediaType) {
        var resolutionMark = ($.inArray(json["packageId"], hdPackages) != -1) ? "HD" : "SD";
        var khz = (Math.floor((samplingFreq / 1000) * 10) / 10).toFixed(1);
        var mhz = (Math.floor((samplingFreq / 1000000) * 10) / 10).toFixed(1);
        if (!mediaFormatNo) {
            $("#package_data").html((json["mediaFlg"] == "1") ? '<div class="music">ミュージック｜AAC-LC 320kbps</div>' : (json["mediaFlg"] == "2") ? '<div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>' : '<div class="music">ミュージック｜AAC-LC 320kbps</div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
        } else {
            var package_hires_logo_img = "/pc/img/logo-hires_30.png";
            if (json["mediaFlg"] == "3" && mediaFormatNo == 10) {
                $("#package_data").html('<div class="music">ミュージック｜AAC-LC 320kbps</div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
            } else if (json["mediaFlg"] == "3" && mediaFormatNo == 12) {
                $("#package_data").html('<div class="highreso">ハイレゾ｜FLAC｜' + khz + 'kHz/' + bitPerSample + 'bit </div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>');
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            } else if (json["mediaFlg"] == "3" && mediaFormatNo == 13) {
                if (mediaType == 9) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DSF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
                } else if (mediaType == 10) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DFF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
                }
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            } else if (json["mediaFlg"] == "3") {
                $("#package_data").html('<div class="music">ミュージック｜AAC-LC 320kbps</div><div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
            } else if (json["mediaFlg"] == "4" && mediaFormatNo == 12) {
                $("#package_data").html('<div class="highreso">ハイレゾ｜FLAC｜' + khz + 'kHz/' + bitPerSample + 'bit </div><div class="music">ミュージック｜AAC-LC 320kbps</div>');
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            } else if (json["mediaFlg"] == "4" && mediaFormatNo == 13) {
                if (mediaType == 9) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DSF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div><div class="music">ミュージック｜AAC-LC 320kbps</div>')
                } else if (mediaType == 10) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DFF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div><div class="music">ミュージック｜AAC-LC 320kbps</div>')
                }
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            } else if (mediaFormatNo == 10) {
                $("#package_data").html('<div class="music">ミュージック｜AAC-LC 320kbps</div>')
            } else if (mediaFormatNo == 11) {
                $("#package_data").html('<div class="video">ビデオ｜' + resolutionMark + ' | AVC/H.264</div>')
            } else if (mediaFormatNo == 12) {
                $("#package_data").html('<div class="highreso">ハイレゾ｜FLAC｜' + khz + 'kHz/' + bitPerSample + 'bit </div>');
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            } else if (mediaFormatNo == 13) {
                if (mediaType == 9) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DSF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div>')
                } else if (mediaType == 10) {
                    $("#package_data").html('<div class="highreso">ハイレゾ｜DSD(DFF)｜' + mhz + 'MHz/' + bitPerSample + 'bit </div>')
                }
                $("#package_hires_logo").attr({
                    "src": package_hires_logo_img,
                    "width": "30",
                    "alt": "hires_logo"
                });
                $("#package_hires_logo").css("display", "block")
            }
        }
    },
    renderRecommend: function (obj, json) {
        var recommendList = json["recommendList"];
        if (recommendList != null && recommendList.length > 0) {
            $("#package_suggest").css("display", "block");
            for (var i = 0; i < recommendList.length; i++) {
                html = '<article class="package_suggestItem" id="package_suggest_item' + (i + 1) + '">';
                var href = recommendList[i]["packagePageUrl"];
                html += '<!--リンク--><a href="' + href + '" class="linkArea"><!--サムネイル--><img src="' + recommendList[i]["packageUrl"] + (recommendList[i]["weblistsizeimage"] || recommendList[i]["fullsizeimage"]) + '" alt="' + SFCommon.getAlt(recommendList[i]["title"], recommendList[i]["artistName"], true) + '"><!--//サムネイル--><div class="package_suggestArtist"><!--アーティスト名-->' + $.escapeHTML(recommendList[i]["artistName"]) + '<!--//アーティスト名--></div><div class="package_suggestTitle"><!--楽曲名-->' + $.escapeHTML(recommendList[i]["title"]) + '<!--//楽曲名--></div></a><!--//リンク-->';
                html += '</article>';
                $("#package_suggest > div > div").append(html)
            }
        }
    },
    renderArtistInfo: function (obj, json) {
        var artistComment = json["artistInfo"] ? json["artistInfo"]["artistComment"] : null;
        if (artistComment != null && artistComment != "") {
            $("#artist_profile").css("display", "block");
            $("#artist_comment").prepend(artistComment)
        }
        var DISCOGRAPHY_DISP_MAX_COUNT = 8;
        var tmpList = json["packageResult"] ? json["packageResult"]["list"] : null;
        var list = [];
        if (tmpList != null && tmpList.length > 0) {
            for (var i = 0; i < tmpList.length; i++) {
                if (tmpList[i]["materialNo"] != materialNo) {
                    list.push(tmpList[i])
                }
            }
        }
        if (list != null && list.length > 0) {
            var count = Math.min(list.length, DISCOGRAPHY_DISP_MAX_COUNT);
            $("#artist_discography").css("display", "block");
            $(".artist_discography_more").attr("href", sfUrl['artist'] + "/" + artistNo + "/");
            for (var i = 0; i < count; i++) {
                var html = '<article class="artist_discography" id="package_artist_item' + (i + 1) + '">' + '<a href="' + list[i]["packagePage"] + '" class="linkArea">' + '<img src="' + list[i]["weblistsizeimage"] + '" alt="' + $.escapeHTML(list[i]["packageTitle"]) + '／' + $.escapeHTML(list[i]["artistName"]) + '">' + '<div class="artist_discography_title">' + $.escapeHTML(list[i]["packageTitle"]) + '</div>';
                if (list[i]["mediaFormatNo"] == 10) {
                    html += '<div class="music">ミュージック</div>'
                } else if (list[i]["mediaFormatNo"] == 11) {
                    html += '<div class="video">ビデオ</div>'
                } else if (list[i]["mediaFormatNo"] == 12 || list[i]["mediaFormatNo"] == 13) {
                    html += '<div class="hires">ハイレゾ</div>'
                }
                html += '</a></article>';
                $("#artist_discography > div > div").append(html)
            }
        }
        new SFCommunicator({
            preloadImg: "http://cf.mora.jp/cfdocs/addition/img/preload_s.gif",
            url: SFPath.getPackage(mountPoint, labelId, materialNo) + "/recommend.json",
            elements: "#package_suggest",
            success: Package.renderRecommend
        }).go()
    },
    renderArtistInfoError: function (xmlHttpRequest, textStatus, errorThrown) {
        new SFCommunicator({
            preloadImg: "http://cf.mora.jp/cfdocs/addition/img/preload_s.gif",
            url: SFPath.getPackage(mountPoint, labelId, materialNo) + "/recommend.json",
            elements: "#package_suggest",
            success: Package.renderRecommend
        }).go()
    },
    convertDateFormat: function (date) {
        return date.substring(0, 4) + "." + date.substring(5, 7) + "." + date.substring(8, 10)
    },
    receivePackageData: function (obj, json) {
        var dispStartDate = $.dateWithString(json["dispStartDate"]);
        if (json["dispFlg"] == 1 || (!sfMode["staging"] && nowDate.getTime() < dispStartDate.getTime())) {
            SFLog.debug("パッケージページは表示できません。dispFlg=" + json["dispFlg"] + ", dispStartDate=" + dispStartDate);
            location.href = sfUrl["notFound"];
            return
        }
        var viewPackagePage = false;
        if (json["distFlg"] == 0 && ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(json["startDate"])), $.dateWithString(json["endDate"])) == 0) && json["price"] != null) {
            viewPackagePage = true
        }
        var trackList = json["trackList"];
        if (!viewPackagePage && trackList != null) {
            for (var i = 0; i < json["trackList"].length; i++) {
                if (trackList[i]["distFlg"] == 1 || ($.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(trackList[i]["startDate"])), $.dateWithString(trackList[i]["endDate"])) != 0)) { } else {
                    viewPackagePage = true;
                    break
                }
            }
        }
        if (!viewPackagePage) {
            location.href = sfUrl["notFound"];
            return
        }
        Package.sfPackageData = json;
        $("body").css("display", "inline");
        Package.renderMain();
        s_onload()
    },
    isViewPrice: function (nowDate, track) {
        if (track["distFlg"] == 0 && $.compareDate(nowDate, ((sfMode["staging"]) ? null : $.dateWithString(track["startDate"])), $.dateWithString(track["endDate"])) != 1 && track["price"] != null) {
            return true
        }
        return false
    },
    getTrackIcon: function (mediaFormatNo, mediaFlg) {
        if (mediaFormatNo == "10" || mediaFormatNo == "12" || mediaFormatNo == "13") {
            return "package_iconAudio"
        } else if (mediaFormatNo == "11") {
            return "package_iconVideo"
        }
        if (mediaFlg == "1") {
            return "package_iconAudio"
        } else if (mediaFlg == "2") {
            return "package_iconVideo"
        }
    },
    bindLyricsBtn: function (options) {
        var isTableLayout = (typeof options.isTableLayout !== 'undefined') ? options.isTableLayout : false;
        var exclusive = (typeof options.exclusive !== 'undefined') ? options.exclusive : true;
        var useKashiCache = (typeof options.useKashiCache !== 'undefined') ? options.useKashiCache : true;
        var useTrackTopAnimation = (typeof options.useTrackTopAnimation !== 'undefined') ? options.useTrackTopAnimation : false;
        var kashiDataCache = {};
        var lyricsWindow = null;
        $(".lyricsBtn").click(function (e, prevLyricsBtn) {
            var closeAction = false;
            if (isTableLayout) {
                closeAction = ($(this).closest("tr").next(".openedLyrics").get(0)) ? true : false
            } else {
                closeAction = ($(this).closest("article").next(".openedLyrics").get(0)) ? true : false
            }
            if (!closeAction) {
                var trackInfo = $.parseJSON($(this).find("input[name=trackInfo]").val());
                var materialNo = trackInfo["materialNo"];
                var currentLyricsBtn = this;
                var showLyrics = function (self, result) {
                    var kashiData = $("#lyricsAreaTemplate").html();
                    kashiData = kashiData.replace(/%{materialNo}/g, materialNo).replace(/%{title}/g, result["title"]).replace(/%{artist}/g, result["artist"]).replace(/%{words}/g, result["words"]).replace(/%{music}/g, result["music"]).replace(/%{lyrics}/g, $.escapeHTML(result["lyrics"]).replace(/\n/g, "<br/>"));
                    if (exclusive) {
                        if (isTableLayout) {
                            $(".openedLyrics").prev("tr").find(".lyricsBtn").trigger("click", currentLyricsBtn)
                        } else {
                            $(".openedLyrics").prev("article").find(".lyricsBtn").trigger("click", currentLyricsBtn)
                        }
                    }
                    var iframe = null;
                    var kashi = null;
                    if (isPC) {
                        var isLyricsWindow = isMediaGo || (window.navigator.userAgent.match(/Win(dows )?NT 6\.0/) && isXapl);
                        var iframeContainer = '<div>' + '<div class="lyricsHeader">' + '<div class="closeLyricsBtnArea"><a class="closeLyricsBtn" href="#" hidefocus="true">閉じる</a></div>' + ((!isLyricsWindow) ? '<div class="openLyricsOnWindowArea"><a class="openLyricsOnWindowBtn" href="#" hidefocus="true">大きなウィンドウで開く</a></div>' : "") + '</div>' + '<iframe class="lyricsIframe" src="/lyricsWithIframe" frameborder="0"></iframe>' + '</div>';
                        iframe = $(iframeContainer).hide();
                        iframe.find("iframe").load(function () {
                            iframe.find("iframe").contents().find("div").html(kashiData)
                        });
                        kashi = iframe
                    } else {
                        var kashiData = '<div>' + '<div class="lyricsHeader">' + '<div class="closeLyricsBtnArea"><a class="closeLyricsBtn" href="#">閉じる</a></div>' + '</div>' + kashiData + '</div>';
                        kashi = $(kashiData).hide()
                    }
                    var kashiContainer = null;
                    if (isTableLayout) {
                        var colspanSize = $(self).closest("tr").find("td").length;
                        kashiContainer = $('<tr class="openedLyrics"><td colspan="' + colspanSize + '"></td></tr>');
                        kashiContainer.find("td").html(kashi);
                        $(self).closest("tr").after(kashiContainer)
                    } else {
                        kashiContainer = $('<article class="openedLyrics"></article>');
                        kashiContainer.html(kashi);
                        $(self).closest("article").after(kashiContainer)
                    }
                    kashi.find(".closeLyricsBtn").click(function () {
                        $(currentLyricsBtn).trigger("click");
                        return false
                    });
                    kashi.find(".openLyricsOnWindowBtn").click(function () {
                        var target = "lyricsWindow";
                        var windowOption = "width=500, height=600, status=no, scrollbars=yes, directories=no,menubar=no,resizable=yes,toolbar=no";
                        lyricsWindow = window.open(sfUrl["lyrics"], target, windowOption);
                        lyricsWindow.focus();
                        var qs = [{
                            type: 'hidden',
                            name: 'materialNo',
                            value: materialNo
                        }];
                        Package.submitDynamicForm(target, qs);
                        return false
                    });
                    kashi.slideDown("fast")
                };
                if (kashiDataCache[materialNo]) {
                    showLyrics(this, kashiDataCache[materialNo])
                } else {
                    var self = this;
                    new SFCommunicator({
                        url: sfUrl["getLyrics"],
                        data: "materialNo=" + materialNo,
                        type: "get",
                        async: true,
                        success: function (obj, result) {
                            if (useKashiCache) {
                                kashiDataCache[materialNo] = result
                            }
                            showLyrics(self, result)
                        },
                        error: function () {
                            alert("歌詞が見つかりませんでした")
                        }
                    }).go()
                }
            } else {
                var isScrollTopAction = prevLyricsBtn && useTrackTopAnimation;
                if (isTableLayout) {
                    $(this).closest("tr").next(".openedLyrics").find("div:eq(0)").slideUp((!isScrollTopAction) ? "fast" : 0,
                        function () {
                            $(this).closest("tr").remove();
                            if (isScrollTopAction) {
                                var posIdx = $("#package_list").find("tbody tr").index($(prevLyricsBtn).closest("tr"));
                                var zoom = $("html").css("zoom");
                                var anchorPoint = $("#package_list").find("tbody tr").eq(posIdx).offset().top;
                                if (zoom) {
                                    anchorPoint = Math.ceil(anchorPoint * zoom)
                                }
                                setTimeout(function () {
                                    $("body").animate({
                                        scrollTop: anchorPoint
                                    },
                                        0)
                                },
                                    200)
                            }
                        })
                } else {
                    $(this).closest("article").next(".openedLyrics").find("div:eq(0)").slideUp((!isScrollTopAction) ? "fast" : 0,
                        function () {
                            $(this).closest("article").remove();
                            if (isScrollTopAction) {
                                var posIdx = $("article.package_listWrapper").index($(prevLyricsBtn).closest("article"));
                                var zoom = $("html").css("zoom");
                                var anchorPoint = $("article.package_listWrapper").eq(posIdx).offset().top;
                                anchorPoint = Math.ceil(anchorPoint * zoom);
                                $("body").animate({
                                    scrollTop: anchorPoint
                                },
                                    0)
                            }
                        })
                }
            }
            return false
        })
    },
    submitDynamicForm: function (target, qs) {
        var form = $("<form/>").attr("action", sfUrl["lyrics"]).attr("target", target).attr("method", "get");
        for (var i = 0; i < qs.length; i++) {
            var ol = qs[i];
            var input = $("<input/>");
            for (var p in ol) {
                input.attr(p, ol[p])
            }
            form.append(input)
        }
        $("body").append(form);
        form.get(0).submit();
        form.remove()
    },
    renderPurchaseBtn: function (onclickCart, onclickCartStay, price) {
        var html = '<td class="package_td7">' + '<div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnPrice btn_cart" ' + onclickCart + '>' + '<span>' + price + '</span>' + '</a><!--//購入ボタン-->' + '</div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnPrice btn_cart" ' + onclickCartStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//購入ボタン-->' + '</div>' + '</div>' + '</td>';
        return html
    },
    renderOneClickBtn: function (onclickCart, onclickCartStay, param, price) {
        var html = '<td class="package_td7">' + '<div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="1クリックで購入" class="package_btnPrice btn_cart" ' + 'onclick="oneClickDialogOpen(dialogOneClick, ' + param + '); event.stopPropagation(); return false;"' + '>' + '<img src="/pc/img/package/amazon-smily-80.png" alt="amazon-smily">' + '<span>' + price + '</span>' + '</a><!--//購入ボタン-->' + '</div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnPrice btn_cart" ' + onclickCartStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//購入ボタン-->' + '</div>' + '</div>' + '</td>';
        return html
    },
    renderMobilePurchaseBtn: function (onclickCart, onclickCartStay, price) {
        var html = '<div>' + '<div>' + '<!--購入ボタン--><a title="買い物カゴに入れる" class="package_listPriceBtn" ' + onclickCart + '>' + '<span>' + price + '</span>' + '</a><!--//購入ボタン-->' + '</div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnPrice btn_cart" ' + onclickCartStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//購入ボタン-->' + '</div>' + '</div>';
        return html
    },
    renderMobileOneClickBtn: function (onclickCart, onclickCartStay, param, price) {
        var html = '<div>' + '<div>' + '<!--購入ボタン--><a title="1クリックで購入" class="package_listPriceBtn btn_oneclick" ' + 'onclick="oneClickDialogOpen(dialogOneClick, ' + param + '); return false;"' + '>' + '<img src="/pc/img/package/amazon-smily-80.png" alt="amazon-smily">' + '<span>' + price + '</span>' + '</a><!--//購入ボタン-->' + '</div>' + '<div>' + '<!--購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnPrice btn_cart" ' + onclickCartStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//購入ボタン-->' + '</div>' + '</div>';
        return html
    },
    renderMatomePurchaseBtn: function (onclick, onclickStay, price) {
        var html = '<div>' + '<div>' + '<!--まとめて購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnBuyAll btn_cart" ' + onclick + '>' + '<span>' + price + '円 まとめて購入' + '</span>' + '</a><!--//まとめて購入ボタン-->' + '</div>' + '<div>' + '<!--まとめて購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnBuyAll btn_cart" ' + onclickStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//まとめて購入ボタン-->' + '</div>' + '</div>';
        return html
    },
    renderMatomeOneClickBtn: function (onclick, onclickStay, param, price) {
        var html = '<div>' + '<div>' + '<!--まとめて購入ボタン--><a href="javascript:void(0);" title="1クリックで購入" class="package_btnBuyAll btn_cart btn_oneclick" ' + 'onclick="oneClickDialogOpen(dialogOneClick, ' + param + '); event.stopPropagation(); return false;"' + '>' + '<img src="/pc/img/package/amazon-smily-80.png" alt="amazon-smily">' + '<span>' + price + '円 まとめて購入' + '</span>' + '</a><!--//まとめて購入ボタン-->' + '</div>' + '<div>' + '<!--まとめて購入ボタン--><a href="javascript:void(0);" title="買い物カゴに入れる" class="package_btnBuyAll btn_cart" ' + onclickStay + '>' + '<img src="/pc/img/package/cart_in.png" alt="cart">' + '</a><!--//まとめて購入ボタン-->' + '</div>' + '</div>';
        return html
    }
};
var escapeQuotes = function (str) {
    var escape = (str) ? str.replace(/'/g, "\\'") : "";
    escape = (escape) ? escape.replace(/"/g, '&quot;') : "";
    return escape
}