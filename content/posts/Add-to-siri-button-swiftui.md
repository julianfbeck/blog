---
title: "Add to Siri Button with SwiftUI"
date: "2020-05-20"
# weight: 1
# aliases: ["/first"]
tags: ["SwiftUI"]
categories: ["iOS", "Swift"]
author: "Julian Beck"
showToc: false
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "How to add an Add to Siri Button to your SwiftUI App"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
cover:
    image: "addtosiributton.png" # image path/url
    alt: "SwiftUI Add to siri button" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/jufabeck2202/blog/tree/master/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

For an app I was building I needed to add an **Add to Siri Button**, to add new Interaction to Shortcuts. While this straightforward in UIKit, it was more challenging in a project that uses SwiftUI.
```

```
SwiftUI makes it easy to build and prototype good-looking UIs for all kinds of applications.
While the code of SwiftUI is simple and clean, it is still young and a lot of API functionality is missing.
That makes it a bit challenging to build applications that access System APIs.

Fortunately,  UIViewControllers can be integrated into SwiftUI with ease using the `UIViewControllerRepresentable`. The following example shows how to add an **Add to Siri Button** using SwiftUI and `UIViewControllerRepresentable` and all required protocols to trigger and **Add to Siri** event.

![ScoreTracker](/addtosiributton.png)

First, we need an `IntentController`, that defines the  **Add to Siri Button**  Button and triggers the `INUIAddVoiceShortcutViewController`, the protocol an object implements to receive notifications from the view controller  when adding a shortcut to Siri:

```swift
class IntentController : UIViewController, INUIAddVoiceShortcutViewControllerDelegate{
    
    private var myTableView: UITableView!
    
    
    override func viewWillDisappear(_ animated: Bool) {
        window2?.tintColor  = UIColor.white
        
    }
    override func viewDidDisappear(_ animated: Bool) {
        window2?.tintColor  = UIColor.white
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

    //Add to Siri Button
        let button = INUIAddVoiceShortcutButton(style: .blackOutline)
        
        self.view.addSubview(button)
        view.centerXAnchor.constraint(equalTo: button.centerXAnchor).isActive = true
        view.centerYAnchor.constraint(equalTo: button.centerYAnchor).isActive = true
        button.translatesAutoresizingMaskIntoConstraints = false
        button.addTarget(self, action: #selector(addToSiri), for: .touchUpInside)
        
        
    }
    
    
    @objc func addToSiri() {
           //add Intent
        let suggentedPhrase = "Add New Score to Game"
        let intent = NewPlayIntent()
        
        
        
        intent.suggestedInvocationPhrase = suggentedPhrase
        if let shortcut = INShortcut(intent: intent) {
            
            
            let viewController = INUIAddVoiceShortcutViewController(shortcut: shortcut)
            
            viewController.modalPresentationStyle = .formSheet
            viewController.delegate = self // Object conforming to `INUIAddVoiceShortcutViewControllerDelegate`.
            present(viewController, animated: true, completion: nil)
            
        }
        
    }
    
    func addVoiceShortcutViewController(_ controller: INUIAddVoiceShortcutViewController, didFinishWith voiceShortcut: INVoiceShortcut?, error: Error?) {
        controller.dismiss(animated: true) {
            
        }
    }
    
    func addVoiceShortcutViewControllerDidCancel(_ controller: INUIAddVoiceShortcutViewController) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    
}
```

And the required Methods for `INUIEditVoiceShortcutViewControllerDelegate`, the protocol an object implements to receive notifications from the view controller that edits or removes a shortcut in Siri:

```swift

extension IntentController: INUIEditVoiceShortcutViewControllerDelegate {
    func editVoiceShortcutViewController(_ controller: INUIEditVoiceShortcutViewController, didUpdate voiceShortcut: INVoiceShortcut?, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    func editVoiceShortcutViewController(_ controller: INUIEditVoiceShortcutViewController, didDeleteVoiceShortcutWithIdentifier deletedVoiceShortcutIdentifier: UUID) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    func editVoiceShortcutViewControllerDidCancel(_ controller: INUIEditVoiceShortcutViewController) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    func present(_ addVoiceShortcutViewController: INUIAddVoiceShortcutViewController, for addVoiceShortcutButton: INUIAddVoiceShortcutButton) {
        addVoiceShortcutViewController.delegate = self
        addVoiceShortcutViewController.modalPresentationStyle = .formSheet
        present(addVoiceShortcutViewController, animated: true, completion: nil)
    }
    
    func present(_ editVoiceShortcutViewController: INUIEditVoiceShortcutViewController, for addVoiceShortcutButton: INUIAddVoiceShortcutButton) {
        editVoiceShortcutViewController.delegate = self
        editVoiceShortcutViewController.modalPresentationStyle = .formSheet
        present(editVoiceShortcutViewController, animated: true, completion: nil)
    }
    
    
}
```
This will present the **Add to Siri** form and allows the user to edit the phrase and afterward add to shortcuts.

![ScoreTracker](/siriModal.png)

After implementing the UIViewController, we can finally use `UIViewControllerRepresentable` to be able to display the 
add to siri Button in SwiftUI:

```swift
struct IntentIntegratetController : UIViewControllerRepresentable{
    
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<IntentIntegratetController>) -> IntentController {
        return IntentController()
date: 2020-05-20-T15:32:49+02:0
    }
    
    func updateUIViewController(_ uiViewController: IntentController, context: UIViewControllerRepresentableContext<IntentIntegratetController>) {
        
    }
    
    typealias UIViewControllerType = IntentController

    
}
```

Final SwiftUI View:
```swift

List {
    IntentIntegratetController().frame(height: 50)
}

```





